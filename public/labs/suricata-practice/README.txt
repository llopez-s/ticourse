ALERTÓPOLIS · LABORATORIO DE SURICATA · PRÁCTICA COMPLEMENTARIA (Security+ sp4m7)
Caso ficticio: una mañana en la Autoridad Portuaria de Halden (14-10-2026).
Dominios .example y direcciones de documentación (RFC 5737): nada de esto es real.
La captura solo contiene peticiones inventadas: ni malware ni datos personales.

Contenido
  capture.pcap     16 conexiones (d1-d7 DNS, h1-h5 HTTP, t1-t4 TLS con SNI)
  corpus.json      qué es cada conexión; make_pcap.py la regenera byte a byte
  missions.json    las cuatro misiones y el resultado esperado de cada conexión
  reference.rules  solución comentada (no la abras antes de intentarlo)
  verify.py        ejecuta Suricata real con tus reglas y compara misión a misión

Requisitos: Python 3.9+ y Suricata 7 instalado (en Linux, el paquete suricata de tu
distribución). No hace falta tarjeta de red, permisos de root ni conexión.

1. Escribe tus reglas en local.rules (o descárgalas del laboratorio de la web).
2. python verify.py --rules local.rules
3. python verify.py --rules local.rules --mission m4
   Si Suricata no está en el PATH: --suricata RUTA. Si no encuentra su yaml: --config RUTA.

verify.py fija HOME_NET a 10.0.0.0/8, 172.16.0.0/12 y 192.168.0.0/16 y EXTERNAL_NET a
!$HOME_NET, lee la captura con -r y, para la misión 4, añade --simulate-ips para
que Suricata se comporte como un sensor en línea. Códigos de salida: 0 todo cumplido,
1 alguna conexión no da lo esperado, 2 alguna regla no carga o Suricata no arrancó.
Una regla que no carga nunca cuenta como «sin alerta».

Lo que demuestra un «cumplida»: que tus reglas dan el resultado pactado sobre estas
dieciséis conexiones, con tu versión de Suricata. No demuestra cobertura frente a
variantes reales ni ausencia de falsos positivos en tu red.

Comandos útiles por tu cuenta:
  suricata -T -S local.rules                      comprobar que cargan
  suricata -S local.rules -r capture.pcap -l out  ejecutar; las alertas quedan en out/eve.json
