// Corpus didáctico e inerte. Ninguna regla acredita detección de malware real.
rule Alertopolis_Demo_Family {
  meta:
    author = "Alertopolis"
    version = "1.0"
    date = "2026-10-19"
    scope = "synthetic ALRTDEMO fixtures, not real malware"
  strings:
    $header = "ALRTDEMO" ascii
    $family = "cicada-demo-v1" ascii wide nocase
    $route = "route=/collect-demo" ascii wide
    $hex = { 41 4C 52 54 ?? 7F }
  condition:
    // Formato inventado: NO es una cabecera PE ni un ejecutable.
    // El límite de tamaño forma parte de este contrato sintético.
    $header at 0 and filesize < 4KB and
    $family and ($route or $hex)
}

rule Alertopolis_Demo_Sample {
  meta:
    scope = "one synthetic build; intentionally narrow"
  strings:
    $build = "build=fixture-A" ascii
  condition:
    Alertopolis_Demo_Family and $build
}

rule Alertopolis_Demo_Hunt {
  meta:
    scope = "broad synthetic triage; review matches manually"
  strings:
    $header = "ALRTDEMO" ascii
    $family = "cicada-demo-v1" ascii wide nocase
    $route = "route=/collect-demo" ascii wide
    $hex = { 41 4C 52 54 ?? 7F }
  condition:
    $header at 0 and filesize < 4KB and
    ($family or $route or $hex)
}
