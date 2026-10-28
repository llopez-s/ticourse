import { question, text, type Option } from './helpers';
import { VIDEO_INVENTORY } from './video-inventory';
import { objectiveForLesson } from './objectives';
import { PRODUCED_PREREQUISITES, PRODUCED_SCENES } from './video-learning-produced';
type Scene = [string,string,string[],number,string,string[]?];
// Two different transfer situations per video, never included in the exam bank.
const SCENES: Record<string,[Scene,Scene]> = {
 ...PRODUCED_SCENES,
 'controles-halden':[
 ['Un hospital instala un sensor que avisa al abrir una puerta. ¿Qué función cumple?','A hospital installs a sensor that alerts when a door opens. What is its function?',['Detectar','Corregir','Recuperar','Autorizar'],0,'El aviso detecta el hecho; no impide físicamente abrir ni recupera el servicio.'],
 ['Una fábrica no puede instalar MFA en una consola antigua. Aísla el acceso en un bastión supervisado. ¿Cómo clasificar esa sustitución?','A factory cannot add MFA to a legacy console and routes access through a monitored bastion. What is the substitute?',['Directivo','Compensatorio','Disuasorio','Correctivo'],1,'El bastión reduce el riesgo del control que no puede implantarse: es compensatorio.']],
 'zero-trust-halden':[
 ['¿Qué componente aplica la decisión de acceso al flujo?','Which component enforces the access decision on the flow?',['Policy engine','Policy administrator','Policy enforcement point','Owner del dato'],2,'El PEP permite o bloquea; el motor decide y el administrador comunica la decisión.'],
 ['Un investigador usa una cuenta válida desde una VPN corporativa, pero el equipo no cumple la postura exigida. ¿Qué decisión encaja?','A researcher uses valid credentials over corporate VPN but the device fails posture checks. What fits Zero Trust?',['Confiar por la VPN','Dar rol administrador','Ignorar la postura','Reevaluar y limitar acceso'],3,'La ubicación interna y una contraseña válida no sustituyen la evaluación contextual.']],
 'cripto-halden':[
 ['Necesitas confidencialidad rápida para un archivo grande y el receptor ya comparte una clave segura. ¿Qué usar?','You need fast confidentiality for a large file and already share a secure key. What fits?',['Cifrado simétrico','Hash sin clave','Firma digital','Salt público'],0,'El cifrado simétrico protege el contenido; un hash o firma no lo ocultan.'],
 ['Un cliente necesita verificar quién firmó una actualización. ¿Qué clave usa para comprobarla?','A client must verify who signed an update. Which key verifies it?',['Privada del cliente','Pública del firmante','Privada del firmante','Clave de sesión ajena'],1,'La clave pública verifica la firma creada con la clave privada del firmante.']],
 'pki-halden':[
 ['La raíz es confiable, pero el servidor omite un certificado intermedio. ¿Qué corregir?','The root is trusted but the server omits an intermediate certificate. What should be fixed?',['Desactivar TLS','Cambiar el usuario','Servir la cadena intermedia','Confiar en toda raíz'],2,'La cadena debe conectar el certificado de servidor con una raíz confiable.'],
 ['El certificado aún no ha caducado, pero se ha filtrado su clave privada. ¿Qué acción corresponde?','A certificate has not expired but its private key leaked. What is required?',['Esperar caducidad','Alargar su vigencia','Publicar la clave','Revocar y sustituir'],3,'La revocación comunica que deja de ser confiable antes de caducar.']],
 'inyeccion-halden':[
 ['La aplicación concatena una entrada en una consulta. ¿Qué separa datos y estructura SQL?','An application concatenates input into a query. What separates data from SQL structure?',['Consulta parametrizada','Hash de contraseña','Certificado cliente','Cifrado del disco'],0,'Los parámetros se tratan como datos y no como fragmentos de SQL.'],
 ['Un comentario almacenado ejecuta JavaScript en otros navegadores. ¿Qué medida protege el contexto HTML?','A stored comment executes JavaScript in other browsers. What protects the HTML context?',['Cambiar DNS','Codificar la salida según contexto','Permitir cualquier etiqueta','Reiniciar la base de datos'],1,'La codificación contextual evita que datos no confiables se interpreten como código en la salida.']],
 'logs-halden':[
 ['El registro muestra una contraseña contra 70 cuentas, una vez por cuenta. ¿Qué patrón encaja?','A log shows one password tried once against 70 accounts. Which pattern fits?',['Credential stuffing','Fuerza bruta por cuenta','Password spraying','Exfiltración DNS'],2,'Spraying distribuye pocos candidatos entre muchas cuentas; no requiere contraseñas robadas.'],
 ['Un reverse proxy registra /..%2f..%2fetc/passwd y respuesta 403. ¿Qué se ha observado?','A reverse proxy logs /..%2f..%2fetc/passwd with response 403. What is observed?',['Lectura confirmada','Ataque SQL exitoso','Persistencia confirmada','Intento de traversal bloqueado'],3,'La ruta intenta atravesar directorios; el 403 no confirma lectura del archivo.']],
 'zonas-halden':[
 ['Un portal público se compromete. ¿Qué ubicación limita que alcance el ERP?','A public portal is compromised. Which placement limits its reach to the ERP?',['DMZ con reglas mínimas','Misma VLAN del ERP','Red de gestión','LAN plana con todo abierto'],0,'Una zona separada con flujos acotados reduce el alcance del compromiso.'],
 ['El análisis requiere ver tráfico sin poder interrumpirlo. ¿Cómo colocar el sensor?','Analysis must observe traffic without being able to interrupt it. How should the sensor be placed?',['En línea bloqueante','En TAP o puerto espejo','Como gateway único','En sustitución del router'],1,'Una copia fuera de banda permite observar sin convertirse en punto de bloqueo.']],
 'fronteras-halden':[
 ['Un switch debe autenticar un equipo antes de admitirlo. ¿Qué mecanismo encaja?','A switch must authenticate a device before admission. Which mechanism fits?',['SPF','NAT','802.1X con EAP','DHCP sin autenticación'],2,'802.1X controla la admisión con intercambio EAP y un servicio de autenticación.'],
 ['Dos sedes necesitan proteger redes completas sobre Internet. ¿Qué opción es adecuada?','Two sites need to protect entire networks over the Internet. Which option fits?',['Telnet público','HTTP sin TLS','Captura en espejo','VPN site-to-site'],3,'Una VPN entre gateways protege la comunicación entre sedes.']],
 'recuperacion-halden':[
 ['Un centro alternativo tiene energía y espacio, pero requiere instalar equipos. ¿Qué tipo es?','An alternate site has power and space but needs equipment installation. Which type is it?',['Cold site','Hot site','Clúster activo-activo','Servicio serverless'],0,'Un cold site requiere más preparación; un hot site tiene capacidad operativa preparada.'],
 ['La copia existe. ¿Qué evidencia demuestra que sirve para recuperar el servicio?','A backup exists. What evidence demonstrates service recovery?',['Inventario del proveedor','Restauración probada con datos verificados','Número de discos','Correo de compra'],1,'Restaurar y validar el servicio comprueba utilidad; poseer la copia no lo hace.']],
 'baseline-halden':[
 ['Una configuración aprobada vuelve a valores inseguros tras cada reinicio. ¿Qué falta?','An approved configuration reverts to unsafe defaults after each reboot. What is missing?',['Nuevo logo','Compra de antivirus','Despliegue y mantenimiento del baseline','Más usuarios locales'],2,'El baseline debe aplicarse de forma persistente y vigilar desviaciones.'],
 ['Una válvula OT no admite parches durante producción. ¿Qué respuesta es defendible mientras se planifica mantenimiento?','An OT valve cannot be patched during production. What is defensible until maintenance?',['Aceptar en silencio','Actualizar sin probar','Desactivar toda vigilancia','Aislar, monitorizar y documentar excepción'],3,'Controles compensatorios y excepción con dueño reducen riesgo sin improvisar una parada.']],
 'wifi-halden':[
 ['Se necesita identificar cada dispositivo corporativo en wifi sin contraseña compartida. ¿Qué elegir?','Corporate Wi-Fi needs individual device identity without a shared password. What fits?',['EAP-TLS y certificados','PSK para todos','SSID oculto solamente','Filtrado MAC solamente'],0,'EAP-TLS permite autenticación basada en certificados; ocultar SSID o filtrar MAC no la sustituye.'],
 ['Las oficinas tienen zonas sin señal después de mover tabiques. ¿Qué debe guiar la recolocación de APs?','Office coverage gaps follow partition changes. What should guide AP relocation?',['Subir potencia al máximo','Site survey y mapa de cobertura','Cambiar el dominio DNS','Desactivar autenticación'],1,'La medición de señal, interferencias y cobertura fundamenta la ubicación.']],
 'identificacion-halden':[
 ['Una revisión debe detectar concatenaciones peligrosas antes de desplegar. ¿Qué técnica corresponde?','A review must detect unsafe concatenation before deployment. Which technique fits?',['DAST sin aplicación','NetFlow','SAST del código','Escaneo físico'],2,'El análisis estático inspecciona el código sin ejecutar la aplicación.'],
 ['Aparece una CVE en una biblioteca transitiva. ¿Qué inventario permite localizar consumidores?','A CVE affects a transitive library. What inventory locates consumers?',['Lista de empleados','Tabla ARP','Agenda de reuniones','SBOM y dependencias'],3,'El inventario de componentes permite relacionar la biblioteca con aplicaciones afectadas.']],
 'cvss-halden':[
 ['Hay un CVSS 9 interno aislado y un 8 expuesto con explotación activa. ¿Qué priorizar inicialmente?','There is an isolated internal CVSS 9 and an exposed CVSS 8 under active exploitation. Which should be prioritized initially?',['Expuesto explotado','Siempre el 9','Ambos por orden alfabético','Solo el más antiguo'],0,'La explotación y exposición pueden superar la diferencia de severidad base.'],
 ['Se aplicó un parche. ¿Qué cierra la validación del hallazgo?','A patch was applied. What validates closure of the finding?',['Cerrar el ticket','Recomprobar versión y comportamiento','Borrar el escaneo anterior','Cambiar el owner'],1,'La revalidación comprueba que la corrección se aplicó y resolvió la condición.']],
 'siem-blue-team':[
 ['¿Qué aporta un SIEM a registros de fuentes distintas?','What does a SIEM add to logs from different sources?',['Parche automático universal','Cifrado de todos los paquetes','Centralización y correlación','Autenticación física'],2,'Centraliza, normaliza y correlaciona eventos; no sustituye todos los controles.'],
 ['Una regla genera cientos de alertas por una tarea autorizada. ¿Qué ajuste conserva detección útil?','A rule raises hundreds of alerts for an authorized job. Which tuning retains useful detection?',['Desactivar todo el SIEM','Borrar la fuente','Ignorar todas las cuentas','Acotar excepción y validar cobertura'],3,'La excepción debe ser específica y probar que sigue detectando actividad distinta.']],
 'capas-halden':[
 ['Se quiere impedir la salida de archivos clasificados por USB. ¿Qué capacidad encaja?','Classified files must not leave over USB. Which capability fits?',['DLP de endpoint','DMARC','NAT','Servidor NTP'],0,'DLP aplica reglas sobre el dato y su canal; DMARC trata autenticación de correo.'],
 ['Una suplantación usa el From de tu dominio. ¿Qué combina alineación y política de tratamiento?','Spoofed mail uses your domain in From. What combines alignment and handling policy?',['Solo cifrado de disco','DMARC con SPF/DKIM','DNS inverso únicamente','Más RAM del gateway'],1,'DMARC comprueba alineación con SPF o DKIM y publica una política.']],
 'iam-halden':[
 ['Una persona cambia de equipo y acumula permisos anteriores. ¿Qué proceso corrige esa acumulación?','An employee changes teams and accumulates previous permissions. What process addresses it?',['Más licencias','Nuevo certificado TLS','Revisión y recertificación de acceso','Abrir todas las carpetas'],2,'La revisión compara permisos con la función actual y retira los que sobran.'],
 ['Un contratista necesita privilegios durante una reparación de una hora. ¿Qué encaja?','A contractor needs privileges for a one-hour repair. What fits?',['Administrador permanente','Cuenta compartida sin log','Contraseña por correo','Acceso JIT con registro'],3,'El acceso temporal reduce privilegio permanente y conserva responsabilidad.']],
 'ir-halden':[
 ['Un equipo comprometido sigue comunicando. Debes limitar propagación conservando evidencia volátil. ¿Qué acción es proporcionada?','A compromised host keeps communicating. You must limit spread while preserving volatile evidence. What fits?',['Aislar de la red','Reinstalar sin captura','Vaciar todos los logs','Publicar la muestra'],0,'El aislamiento contiene; apagar o reinstalar puede perder evidencia necesaria.'],
 ['Un servidor limpio vuelve a comprometirse por la misma cuenta. ¿Qué faltó considerar?','A cleaned server is compromised again through the same account. What was overlooked?',['El color del rack','Alcance de identidad y causa raíz','La marca de teclado','El tamaño del monitor'],1,'Limpiar un host no elimina credenciales o sesiones comprometidas ni la vía de entrada.']],
 'ir-halden-pruebas':[
 ['El equipo debate decisiones sobre una historia sin ejecutar cambios. ¿Qué ejercicio realiza?','A team discusses decisions in a scenario without executing changes. Which exercise is this?',['Failover real','Escaneo autenticado','Tabletop','Restauración paralela'],2,'El tabletop ensaya coordinación y decisiones mediante discusión.'],
 ['No existe alerta, pero se busca una técnica concreta a partir de una hipótesis. ¿Qué actividad es?','No alert exists, but a team searches for a technique based on a hypothesis. Which activity is this?',['Archivado rutinario','Inventario de licencias','Aceptación de riesgo','Threat hunting'],3,'La caza parte de hipótesis para buscar actividad que no necesariamente activó alertas.']],
 'forense-adquisicion':[
 ['Necesitas analizar un disco sin modificar el original. ¿Qué procedimiento corresponde?','You need to examine a disk without modifying the original. Which procedure fits?',['Imagen con bloqueo de escritura y hashes','Arrancar el OS original','Borrar temporales primero','Editar archivos sospechosos'],0,'La adquisición y verificación conservan un original contrastable.'],
 ['Una evidencia cambia de custodio. ¿Qué debe registrarse?','Evidence changes custodian. What must be recorded?',['Solo el nombre del archivo','Quién, cuándo, motivo e integridad','Solo el coste del disco','La contraseña del administrador'],1,'La cadena de custodia documenta la transferencia y permite justificar continuidad.']],
 'ale-halden':[
 ['Un activo vale 80.000 € y un evento destruye el 25%. ¿Cuál es el SLE?','An asset is worth €80,000 and one event destroys 25%. What is SLE?',['320.000 €','80.000 €','20.000 €','2.000 €'],2,'SLE = valor del activo × factor de exposición: 80.000 × 0,25.'],
 ['El SLE es 12.000 € y la frecuencia anual 0,2. ¿Cuál es el ALE?','SLE is €12,000 and annual frequency is 0.2. What is ALE?',['60.000 €','12.000 €','200 €','2.400 €'],3,'ALE = SLE × ARO: 12.000 × 0,2 = 2.400 € al año.']],
 'bia-halden':[
 ['Se exige perder como máximo 15 minutos de datos. ¿Qué objetivo expresa esa condición?','No more than 15 minutes of data may be lost. Which objective expresses this?',['RPO','RTO','MTTR','MTBF'],0,'RPO acota la antigüedad del punto de recuperación, no la duración de la interrupción.'],
 ['Se exige volver a operar antes de dos horas. ¿Qué objetivo expresa esa condición?','Operations must resume within two hours. Which objective expresses this?',['RPO','RTO','MTBF','ARO'],1,'RTO acota el tiempo de recuperación; el volumen temporal de datos perdidos es RPO.']],
};
const PREREQUISITES:Record<string,string[]>={
 ...PRODUCED_PREREQUISITES,
 'controles-halden':['f02','f03'],'zero-trust-halden':['f05','f11'],'cripto-halden':['f10','f11'],'pki-halden':['f09','f10'],'inyeccion-halden':['f03','f10'],
 'logs-halden':['f05','f08','f12'],'zonas-halden':['f06','f07','f08'],'fronteras-halden':['f05','f07','f11'],'recuperacion-halden':['f01','f02'],
 'baseline-halden':['f02','f03','f04'],'wifi-halden':['f05','f08','f11'],'identificacion-halden':['f02','f04'],'cvss-halden':['f02','f08'],
 'siem-blue-team':['f04','f12'],'capas-halden':['f05','f08','f10'],'iam-halden':['f03','f11'],'ir-halden':['f02','f04','f12'],
 'ir-halden-pruebas':['f02','f12'],'forense-adquisicion':['f01','f03','f04'],'ale-halden':['f01'],'bia-halden':['f01','f02'],
};
const REVIEW_CHAPTER:Record<string,number>={'controles-halden':2,'zero-trust-halden':0,'cripto-halden':3,'pki-halden':1,'inyeccion-halden':1,'logs-halden':1,'zonas-halden':4,'fronteras-halden':2,'recuperacion-halden':1,'baseline-halden':2,'wifi-halden':1,'identificacion-halden':1,'cvss-halden':1,'siem-blue-team':2,'capas-halden':1,'iam-halden':4,'ir-halden':2,'ir-halden-pruebas':1,'forense-adquisicion':2,'ale-halden':1,'bia-halden':0};
const EN:Record<string,string>=Object.fromEntries(`Detectar|Detect
Corregir|Correct
Recuperar|Recover
Autorizar|Authorize
Directivo|Directive
Compensatorio|Compensating
Disuasorio|Deterrent
Correctivo|Corrective
Owner del dato|Data owner
Confiar por la VPN|Trust because of VPN
Dar rol administrador|Grant an administrator role
Ignorar la postura|Ignore posture
Reevaluar y limitar acceso|Reevaluate and restrict access
Cifrado simétrico|Symmetric encryption
Hash sin clave|Unkeyed hash
Firma digital|Digital signature
Salt público|Public salt
Privada del cliente|Client private key
Pública del firmante|Signer public key
Privada del firmante|Signer private key
Clave de sesión ajena|Another party session key
Desactivar TLS|Disable TLS
Cambiar el usuario|Change the user
Servir la cadena intermedia|Serve the intermediate chain
Confiar en toda raíz|Trust every root
Esperar caducidad|Wait for expiration
Alargar su vigencia|Extend validity
Publicar la clave|Publish the key
Revocar y sustituir|Revoke and replace
Consulta parametrizada|Parameterized query
Hash de contraseña|Password hash
Certificado cliente|Client certificate
Cifrado del disco|Disk encryption
Cambiar DNS|Change DNS
Codificar la salida según contexto|Encode output for its context
Permitir cualquier etiqueta|Allow every tag
Reiniciar la base de datos|Restart the database
Fuerza bruta por cuenta|Per-account brute force
Exfiltración DNS|DNS exfiltration
Lectura confirmada|Confirmed file read
Ataque SQL exitoso|Successful SQL attack
Persistencia confirmada|Confirmed persistence
Intento de traversal bloqueado|Blocked traversal attempt
DMZ con reglas mínimas|DMZ with minimum rules
Misma VLAN del ERP|Same VLAN as the ERP
Red de gestión|Management network
LAN plana con todo abierto|Flat LAN allowing everything
En línea bloqueante|Inline prevention
En TAP o puerto espejo|TAP or mirror port
Como gateway único|As the only gateway
En sustitución del router|Replacing the router
802.1X con EAP|802.1X with EAP
DHCP sin autenticación|Unauthenticated DHCP
Telnet público|Public Telnet
HTTP sin TLS|HTTP without TLS
Captura en espejo|Mirrored capture
VPN site-to-site|Site-to-site VPN
Clúster activo-activo|Active-active cluster
Servicio serverless|Serverless service
Inventario del proveedor|Vendor inventory
Restauración probada con datos verificados|Tested restoration with verified data
Número de discos|Number of disks
Correo de compra|Purchase email
Nuevo logo|New logo
Compra de antivirus|Antivirus purchase
Despliegue y mantenimiento del baseline|Baseline deployment and maintenance
Más usuarios locales|More local users
Aceptar en silencio|Accept silently
Actualizar sin probar|Update without testing
Desactivar toda vigilancia|Disable all monitoring
Aislar, monitorizar y documentar excepción|Isolate, monitor and document an exception
EAP-TLS y certificados|EAP-TLS and certificates
PSK para todos|PSK for everyone
SSID oculto solamente|Hidden SSID only
Filtrado MAC solamente|MAC filtering only
Subir potencia al máximo|Maximize transmit power
Site survey y mapa de cobertura|Site survey and coverage map
Cambiar el dominio DNS|Change the DNS domain
Desactivar autenticación|Disable authentication
DAST sin aplicación|DAST without an application
SAST del código|Code SAST
Escaneo físico|Physical scanning
Lista de empleados|Employee list
Tabla ARP|ARP table
Agenda de reuniones|Meeting calendar
SBOM y dependencias|SBOM and dependencies
Expuesto explotado|Exposed and exploited asset
Siempre el 9|Always the score of 9
Ambos por orden alfabético|Both in alphabetical order
Solo el más antiguo|Only the oldest
Cerrar el ticket|Close the ticket
Recomprobar versión y comportamiento|Recheck version and behavior
Borrar el escaneo anterior|Delete the earlier scan
Cambiar el owner|Change the owner
Parche automático universal|Universal automatic patching
Cifrado de todos los paquetes|Encryption of every packet
Centralización y correlación|Centralization and correlation
Autenticación física|Physical authentication
Desactivar todo el SIEM|Disable the entire SIEM
Borrar la fuente|Delete the source
Ignorar todas las cuentas|Ignore every account
Acotar excepción y validar cobertura|Narrow the exception and validate coverage
DLP de endpoint|Endpoint DLP
Servidor NTP|NTP server
Solo cifrado de disco|Disk encryption only
DMARC con SPF/DKIM|DMARC with SPF/DKIM
DNS inverso únicamente|Reverse DNS only
Más RAM del gateway|More gateway RAM
Más licencias|More licenses
Nuevo certificado TLS|New TLS certificate
Revisión y recertificación de acceso|Access review and recertification
Abrir todas las carpetas|Open every folder
Administrador permanente|Permanent administrator
Cuenta compartida sin log|Unlogged shared account
Contraseña por correo|Emailed password
Acceso JIT con registro|Logged JIT access
Aislar de la red|Isolate from the network
Reinstalar sin captura|Reinstall without acquisition
Vaciar todos los logs|Clear all logs
Publicar la muestra|Publish the sample
El color del rack|Rack color
Alcance de identidad y causa raíz|Identity scope and root cause
La marca de teclado|Keyboard brand
El tamaño del monitor|Monitor size
Failover real|Live failover
Escaneo autenticado|Authenticated scan
Restauración paralela|Parallel restoration
Archivado rutinario|Routine archiving
Inventario de licencias|License inventory
Aceptación de riesgo|Risk acceptance
Imagen con bloqueo de escritura y hashes|Write-blocked imaging with hashes
Arrancar el OS original|Boot the original OS
Borrar temporales primero|Delete temporary files first
Editar archivos sospechosos|Edit suspicious files
Solo el nombre del archivo|Only the filename
Quién, cuándo, motivo e integridad|Who, when, purpose and integrity
Solo el coste del disco|Only disk cost
La contraseña del administrador|Administrator password`.split('\n').map(line=>line.split('|')));
const BRIEF:Record<string,[string,string]>={
 'zero-trust-halden-2':['Reevaluar acceso','Reevaluate access'],
 'cripto-halden-1':['Cifrado AES','AES encryption'],
 'pki-halden-1':['Completar cadena','Complete chain'],
 'inyeccion-halden-2':['Codificar salida','Output encoding'],
 'baseline-halden-2':['Aislamiento documentado','Documented isolation'],
 'identificacion-halden-2':['SBOM','SBOM'],
 'cvss-halden-2':['Revalidar corrección','Validate the fix'],
 'siem-blue-team-2':['Excepción acotada','Scoped exception'],
 'capas-halden-2':['DMARC','DMARC'],
 'iam-halden-1':['Recertificar acceso','Recertify access'],
 'forense-adquisicion-1':['Imagen verificada','Verified image'],
 'forense-adquisicion-2':['Trazabilidad de custodia','Custody traceability'],
};
export const VIDEO_LEARNING = VIDEO_INVENTORY.filter(v=>v.track==='secplus' && v.status==='integrated' && !v.lessonId.startsWith('sp7')).map(v=>{
  const objectives=objectiveForLesson(v.lessonId);
  const objective=objectives[0]?.id??'preparación';
  return {videoId:v.id,lessonId:v.lessonId,objectives:objectives.map(o=>o.id),prerequisites:PREREQUISITES[v.id],
    guidingQuestion:objectives.length?`¿Qué decisión permite tomar este caso sobre ${objectives[0].title.toLowerCase()}?`:'¿Cómo interpretas las condiciones de una pregunta y repartes el tiempo sin recurrir a ayudas?',
    activities:(SCENES[v.id]??[]).map((r,i)=>question(`video-${v.id}-${i+1}`,objective,objectives.length?Number(objective[0]):0,text(r[0],r[1]),
      r[2].map((c,n)=>[n===r[3]?(BRIEF[`${v.id}-${i+1}`]?.[0]??c):c,n===r[3]?(BRIEF[`${v.id}-${i+1}`]?.[1]??r[5]?.[n]??EN[c]??c):(r[5]?.[n]??EN[c]??c),n===r[3]?r[4]:`No resuelve esta condición. ${r[4]}`] as Option),[r[3]],{lessonId:v.lessonId,videoId:v.id,chapter:i===1?(REVIEW_CHAPTER[v.id]??1):0},i===0?'understand':'apply'))};
});
