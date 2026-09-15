import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { getSiteConfig, createAdminClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * GET /api/site-config
 * Returns a minimal subset of site_config safe for public consumption.
 * Used by the SiteHeader and other public-facing components to pull
 * admin-controlled branding (logo URL, brand name, badge text).
 *
 * Modified to bypass CDN caching to instantly reflect changes
 * after the admin clicks save.
 */
export async function GET() {
  try {
    const data = await getSiteConfig()

    // Only expose the fields needed for public rendering
    const publicConfig = {
      logoUrl:    data?.logo_url    ?? '/images/flowtaris-logo.png',
      brandName:  (data as any)?.header_brand_name ?? 'Flowtaris',
      badgeText:  (data as any)?.header_badge_text  ?? '.ai',
      showLogo:   (data as any)?.header_show_logo   !== false,
      siteName:   data?.site_name   ?? 'Flowtaris AI',
      tagline:    data?.tagline     ?? 'Enterprise AI Automation for Finance',
      navigation: data?.navigation  ?? {},
      trustSignals: (data as any)?.trust_signals ?? [
        { id: '1', label: 'Certified', value: 'SOC 2' },
        { id: '2', label: 'Compliant', value: 'GDPR' },
        { id: '3', label: 'Certified', value: 'ISO 27001' },
        { id: '4', label: 'Uptime SLA', value: '99.99%' },
        { id: '5', label: 'API Calls/Day', value: '50M+' },
        { id: '6', label: 'Trusted By', value: 'Fortune 500' },
      ],
      dualVision: (data as any)?.dual_vision ?? null,
      heroConfig: (data as any)?.hero_config ?? null,
      intelligenceSuiteConfig: (data as any)?.intelligence_suite_config ?? null,
      capabilitiesSectionConfig: (data as any)?.capabilities_section_config ?? null,
      costSectionConfig: (data as any)?.cost_section_config ?? null,
      newsletterConfig: (data as any)?.newsletter_config ?? null,
      socialLinks: (function() {
        const configArr = (data as any)?.social_links_config;
        if (Array.isArray(configArr) && configArr.length > 0) {
          const map: any = {};
          configArr.forEach((item: any) => {
            if (item.platform && item.url) map[item.platform] = item.url;
          });
          return map;
        }
        return (data as any)?.social_links ?? null;
      })(),
      privacyPolicyUrl: (data as any)?.privacy_policy_url ?? null,
      termsOfServiceUrl: (data as any)?.terms_of_service_url ?? null,
      insightsHeroConfig: (data as any)?.insights_hero_config ?? null,
      caseStudiesHeroConfig: (data as any)?.case_studies_hero_config ?? null,
      aboutConfig: (data as any)?.about_config ?? (data as any)?.seo?.about_config ?? null,
      contactConfig: (data as any)?.contact_config ?? (data as any)?.seo?.contact_config ?? null,
      assessmentConfig: (data as any)?.assessment_config ?? (data as any)?.seo?.assessment_config ?? null,
      roiCalculatorConfig: (data as any)?.roi_calculator_config ?? (data as any)?.seo?.roi_calculator_config ?? null,
      coiCalculatorConfig: (data as any)?.coi_calculator_config ?? (data as any)?.seo?.coi_calculator_config ?? null,
    }

    return NextResponse.json(publicConfig, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error) {
    console.error('[/api/site-config] Failed to fetch:', error)
    // Return safe defaults never fail the header render
    return NextResponse.json(
      {
        logoUrl:   '/images/flowtaris-logo.png',
        brandName: 'Flowtaris',
        badgeText: '.ai',
        showLogo:  true,
        siteName:  'Flowtaris AI',
        tagline:   'Enterprise AI Automation for Finance',
        navigation: {},
        trustSignals: [],
        heroConfig: null,
        intelligenceSuiteConfig: null,
        capabilitiesSectionConfig: null,
        costSectionConfig: null,
        newsletterConfig: null,
        socialLinks: null,
        privacyPolicyUrl: null,
        termsOfServiceUrl: null,
        insightsHeroConfig: null,
        caseStudiesHeroConfig: null,
        aboutConfig: null,
        contactConfig: null,
        assessmentConfig: null,
        roiCalculatorConfig: null,
        coiCalculatorConfig: null,
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      }
    )
  }
}

/**
 * POST /api/site-config
 * Updates site_config using the service-role admin client (server-side only).
 * The anon key cannot UPDATE via RLS, so all saves must go through this route.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const allowedFields = [
      'site_name', 'site_url', 'tagline', 'logo_url', 'favicon_url',
      'header_brand_name', 'header_badge_text', 'header_show_logo',
      'navigation', 'social_links', 'contact_email', 'support_email',
      'privacy_policy_url', 'terms_of_service_url', 'cookie_policy_url',
      'analytics', 'seo', 'trust_signals', 'hero_config',
      'dual_vision', 'intelligence_suite_config', 'capabilities_section_config',
      'cost_section_config', 'newsletter_config', 'insights_hero_config',
      'case_studies_hero_config', 'about_config', 'contact_config', 'assessment_config',
      'roi_calculator_config', 'coi_calculator_config'
    ]

    const updatePayload: Record<string, any> = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updatePayload[field] = body[field]
      }
    }

    const adminClient = createAdminClient()

    // Get the current row ID and existing seo
    const { data: currentConfig } = await adminClient
      .from('site_config')
      .select('id, seo')
      .limit(1)
      .single()

    const configId = currentConfig?.id || '00000000-0000-0000-0000-000000000001'
    const existingSeo = (currentConfig?.seo && typeof currentConfig.seo === 'object') ? { ...currentConfig.seo } : {}

    if (body.about_config !== undefined) {
      existingSeo.about_config = body.about_config
      delete updatePayload.about_config
      updatePayload.seo = existingSeo
    }

    if (body.contact_config !== undefined) {
      existingSeo.contact_config = body.contact_config
      delete updatePayload.contact_config
      updatePayload.seo = existingSeo
    }

    if (body.assessment_config !== undefined) {
      existingSeo.assessment_config = body.assessment_config
      delete updatePayload.assessment_config
      updatePayload.seo = existingSeo
    }

    if (body.roi_calculator_config !== undefined) {
      existingSeo.roi_calculator_config = body.roi_calculator_config
      delete updatePayload.roi_calculator_config
      updatePayload.seo = existingSeo
    }

    if (body.coi_calculator_config !== undefined) {
      existingSeo.coi_calculator_config = body.coi_calculator_config
      delete updatePayload.coi_calculator_config
      updatePayload.seo = existingSeo
    }

    const { error } = await adminClient
      .from('site_config')
      .update(updatePayload)
      .eq('id', configId)

    if (error) {
      console.error('[POST /api/site-config] Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: any) {
    console.error('[POST /api/site-config] Unexpected error:', err)
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 })
  }
}

