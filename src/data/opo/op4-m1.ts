import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP4M1 — Alta disponibilidad: conceptos y cálculo
// ---------------------------------------------------------------------------
export const OP4_M1: Module = {
  id: 'op4m1',
  sectionId: 'op4',
  title: 'Alta disponibilidad: conceptos y cálculo',
  minutes: 25,
  objectives: [
    'Traducir un porcentaje de disponibilidad («los nueves») a minutos de parada al año y al mes, y estimarlo a partir del MTBF y el MTTR',
    'Calcular la disponibilidad de componentes en serie y en paralelo y localizar el punto único de fallo de una cadena',
    'Distinguir N+1 y 2N, activo-activo y activo-pasivo, conmutación por error y vuelta al nodo original',
    'Explicar qué son el latido, el quórum y el testigo en un clúster y por qué existen: evitar el cerebro dividido (split-brain)',
    'Aplicar todo lo anterior a la pareja de balanceadores ADC1 y ADC2 del Consorcio y a su CPD único',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Decir que un servicio «tiene que estar siempre disponible» no sirve para diseñar nada. Lo que sí sirve es una cifra: cuánto tiempo puede estar parado al año, cada cuánto se rompe lo que lo sostiene y cuánto se tarda en recuperarlo. Esta lección pone números a la **alta disponibilidad** (*high availability*): los famosos «nueves», el **MTBF** y el **MTTR**, el cálculo de componentes **en serie** y **en paralelo**, y las piezas con las que se monta un servicio redundante, del **latido** al **quórum**. Al final, todo se aplica a la pareja de balanceadores que el Consorcio Provincial de Arcedo tiene en su CPD.',
    },
    { t: 'h', text: 'Disponibilidad y «nueves»' },
    {
      t: 'p',
      md: 'La **disponibilidad** es el porcentaje de tiempo que un servicio está en marcha dentro de un periodo, normalmente un mes o un año. Así la define el pilar de fiabilidad del marco **AWS Well-Architected** (de *Amazon Web Services*; documentación de un fabricante, no una norma), que además desaconseja descontar del tiempo total las paradas de mantenimiento programado: para quien usa el servicio, parado es parado. Como los porcentajes altos se parecen mucho entre sí, se nombran por sus nueves: 99,9 % son «tres nueves» y 99,999 %, «cinco nueves». Lo útil es convertirlos en tiempo: la parada permitida es **(1 − A) × tiempo total**. La tabla siguiente usa un año de **365 días** (525 600 minutos) y un mes de **30 días** (43 200 minutos); con un año de 365,25 días las cifras suben un 0,07 %, así que no conviene mezclar las dos bases.',
    },
    {
      t: 'table',
      headers: ['Disponibilidad', 'Parada al año (365 días)', 'Parada al mes (30 días)'],
      rows: [
        ['99 %', '5256 min = **87 h 36 min** (3 d 15 h 36 min)', '432 min = **7 h 12 min**'],
        ['99,5 %', '2628 min = **43 h 48 min**', '216 min = **3 h 36 min**'],
        ['99,9 % (tres nueves)', '525,6 min = **8 h 45 min 36 s**', '43,2 min = **43 min 12 s**'],
        ['99,95 %', '262,8 min = **4 h 22 min 48 s**', '21,6 min = **21 min 36 s**'],
        ['99,99 % (cuatro nueves)', '52,56 min = **52 min 33,6 s**', '4,32 min = **4 min 19,2 s**'],
        ['99,999 % (cinco nueves)', '5,256 min = **5 min 15,4 s**', '0,432 min = **25,9 s**'],
        ['99,9999 % (seis nueves)', '0,5256 min = **31,5 s**', '0,0432 min = **2,6 s**'],
      ],
    },
    {
      t: 'p',
      md: 'Dos detalles evitan errores. El primero: cada nueve más divide la parada **entre diez**, no entre dos; pasar de tres a cuatro nueves es pasar de casi nueve horas al año a menos de una hora. El segundo: la propia AWS publica esta tabla **redondeada** («52 min» y «5 min» al año para cuatro y cinco nueves), mientras que la cuenta exacta con 365 días da 52 min 33,6 s y 5 min 15,4 s. En un cálculo hay que decir siempre con qué año y con qué mes se trabaja.',
    },
    {
      t: 'check',
      q: {
        q: 'Un servicio se compromete a un 99,9 % de disponibilidad mensual, contando un mes de 30 días. ¿Cuánto tiempo de parada admite en ese mes?',
        choices: [
          '8 h 45 min 36 s',
          '43 min 12 s',
          '4 min 19,2 s',
          '7 h 12 min',
        ],
        answer: 1,
        explain:
          'La parada permitida es (1 − 0,999) × 43 200 min = 43,2 min, es decir, 43 min 12 s. Las 8 h 45 min 36 s son la parada de un 99,9 % pero al año, no al mes: es la confusión más habitual. 4 min 19,2 s corresponden a cuatro nueves al mes, y 7 h 12 min, a un 99 % al mes.',
      },
    },
    { t: 'h', text: 'MTBF y MTTR' },
    {
      t: 'p',
      md: 'La tabla dice cuánto se puede parar, pero no de dónde sale la disponibilidad de un equipo. Para estimarla se usan dos medias. El **MTBF** (*Mean Time Between Failure*, tiempo medio entre fallos) mide cuánto aguanta algo funcionando entre una avería y la siguiente. El **MTTR** mide cuánto se tarda en volver a dar servicio después de cada avería; AWS lo expande como *Mean Time to Recover*, tiempo medio de recuperación, y otras fuentes lo leen como tiempo de reparación o de restauración, así que conviene definirlo cada vez que se use. Con las dos, el marco AWS Well-Architected estima la disponibilidad como **MTBF / (MTBF + MTTR)**: el tiempo bueno dividido entre el ciclo completo, bueno más malo. Es una fórmula que AWS presenta en su documentación (no una norma), pero la aritmética es general.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Disponibilidad estimada con MTBF y MTTR (ejemplo de AWS Well-Architected)',
      text: `MTBF = 150 días = 150 × 24 h = 3600 h
MTTR = 1 h

Disponibilidad = MTBF / (MTBF + MTTR) = 3600 / (3600 + 1) = 3600 / 3601 = 0,999722…  →  99,97 %

Lectura: el equipo falla de media cada 150 días y cada avería cuesta una hora.
Para subir de nivel hay dos palancas: que falle menos (MTBF mayor) o que se recupere antes (MTTR menor).`,
    },
    {
      t: 'p',
      md: 'La segunda palanca suele ser la barata. Un repuesto en el armario, un procedimiento escrito o una conmutación automática no hacen que el equipo se rompa menos, pero acortan el MTTR, y con él sube la disponibilidad. Por eso casi toda la alta disponibilidad consiste en **recuperar antes**, idealmente sin que nadie tenga que intervenir. Los objetivos de recuperación de un plan de continuidad, el RTO (*Recovery Time Objective*, tiempo objetivo de recuperación) y el RPO (*Recovery Point Objective*, punto objetivo de recuperación), ya se ven en la lección de resiliencia de Security+, enlazada al final.',
    },
    {
      t: 'check',
      q: {
        q: 'Un servidor tiene un MTBF de 999 horas y un MTTR, entendido como tiempo medio hasta recuperar el servicio, de 1 hora. Con la fórmula de AWS Well-Architected, ¿qué disponibilidad estimada tiene?',
        choices: [
          '99,99 %',
          '99,8 %',
          '99,9 %',
          '99 %',
        ],
        answer: 2,
        explain:
          'MTBF / (MTBF + MTTR) = 999 / (999 + 1) = 999 / 1000 = 0,999, es decir, 99,9 %. El 99,99 % saldría si el MTBF fuera de 9999 horas, y el 99 % si fuera de 99. El 99,8 % no corresponde a ninguna lectura de los datos.',
      },
    },
    { t: 'h', text: 'En serie y en paralelo' },
    {
      t: 'p',
      md: 'Un servicio casi nunca depende de una sola pieza. Cuando necesita **todas** las piezas a la vez (si cae una, cae el servicio), las piezas están **en serie**; AWS las llama dependencias duras (*hard dependencies*) y su disponibilidad conjunta es el **producto de las disponibilidades**. Como cada factor es menor que 1, la cadena siempre queda **por debajo** de su pieza más débil: tres piezas al 99,99 % dan 0,9999³ = 0,99970003, un 99,97 %. Cuando el servicio aguanta mientras quede **al menos una** pieza viva, las piezas están **en paralelo** (componentes redundantes) y lo que se multiplica son las **indisponibilidades**: A = 1 − (1 − A₁) × (1 − A₂). Dos piezas al 99,9 % dan 1 − 0,001 × 0,001 = 0,999999, seis nueves; si todas las piezas son «de nueves», el atajo que da AWS es sumarlos (3 + 3 = 6).',
    },
    {
      t: 'table',
      headers: ['', 'En serie', 'En paralelo'],
      rows: [
        ['Cuándo cae el servicio', 'Cuando cae **cualquiera** de las piezas', 'Solo cuando caen **todas** las piezas'],
        ['Qué se multiplica', 'Las disponibilidades: A₁ × A₂ × …', 'Las indisponibilidades: 1 − (1 − A₁) × (1 − A₂) × …'],
        ['Efecto en el total', 'Baja: siempre por debajo de la pieza más débil', 'Sube: por encima de la mejor pieza'],
        ['Ejemplo (AWS)', '99,99 % × 99,99 % × 99,99 % = **99,97 %**', '100 % − (0,1 % × 0,1 %) = **99,9999 %**'],
        ['Hipótesis escondida', '—', 'Que las piezas fallen de forma **independiente**'],
      ],
    },
    {
      t: 'p',
      md: 'Esa última fila es la que más se olvida. El cálculo en paralelo supone que las dos piezas no fallan por la misma causa. Dos balanceadores en el mismo armario, con la misma alimentación y detrás de la misma línea, no son independientes: un corte de luz en la sala o una avería de la línea los tumba a la vez, y el 99,9999 % calculado es una ilusión. A la pieza cuyo fallo, ella sola, detiene el servicio se la llama **punto único de fallo** (*single point of failure*, SPOF). Es un concepto de práctica habitual, no una definición de una norma, y encontrarlo es el primer paso de cualquier diseño: no sirve de nada doblar una pieza si al lado queda otra sin doblar.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Ejemplo resuelto: la cadena de la sede electrónica (disponibilidades supuestas para el ejercicio)',
      text: `Cadena: línea del operador → encaminador → pareja de balanceadores → pareja de servidores
(los porcentajes son SUPUESTOS para el cálculo, no datos del Consorcio)

  Línea del operador       una sola                 A = 99,9 %   = 0,999
  Encaminador              uno solo                 A = 99,9 %   = 0,999
  Balanceadores ADC1/ADC2  dos al 99,9 %, paralelo  A = 1 − 0,001 × 0,001 = 0,999999
  Servidores SEDE1/SEDE2   dos al 99 %, paralelo    A = 1 − 0,01 × 0,01   = 0,9999

Paso 1  línea × encaminador         0,999 × 0,999            = 0,998001
Paso 2  × balanceadores             0,998001 × 0,999999      = 0,998000002 (redondeado)
Paso 3  × servidores                0,998000002 × 0,9999     = 0,997900202  →  99,79 %

Parada al año (365 días): (1 − 0,997900202) × 525 600 min = 0,002099798 × 525 600 ≈ 1103,7 min ≈ 18 h 24 min

Comparaciones
  Solo línea y encaminador:          0,998001  →  99,80 %  →  ≈ 1050,7 min al año (17 h 31 min)
  Con un solo balanceador (99,9 %):  0,998001 × 0,999 × 0,9999 = 0,996903…  →  99,69 %  →  ≈ 1627,6 min (27 h 8 min)

Lectura: la línea y el encaminador, que no están doblados, ponen unos 1051 de los 1104 minutos
de parada anual. Doblar los balanceadores ahorra unos 524 minutos al año (8 h 44 min), pero el techo lo fijan
los dos puntos únicos de fallo.`,
    },
    {
      t: 'check',
      q: {
        q: 'Un servicio necesita a la vez un cortafuegos al 99,9 % y un servidor al 99,9 %; si cualquiera de los dos cae, no hay servicio. ¿Qué disponibilidad tiene el conjunto, suponiendo fallos independientes?',
        choices: [
          '99,9 %, la de la pieza más débil',
          '99,9999 %, porque son dos piezas',
          '99,8001 %',
          '99,95 %, la media de las dos',
        ],
        answer: 2,
        explain:
          'Las dos piezas están en serie: se multiplican las disponibilidades, 0,999 × 0,999 = 0,998001, un 99,8001 %. El 99,9999 % es el resultado en paralelo, cuando basta con que quede una viva; aquí hacen falta las dos. Una cadena en serie siempre queda por debajo de su pieza más débil, nunca igual ni en la media.',
      },
    },
    { t: 'h', text: 'Cómo se monta la redundancia' },
    {
      t: 'p',
      md: 'Doblar piezas admite varias formas, y conviene nombrarlas bien. **N+1** significa tener los equipos que hacen falta para la carga (N) **más uno** de reserva: si hacen falta tres fuentes de alimentación, se ponen cuatro. **2N** significa duplicar **todo**: dos conjuntos completos, cada uno capaz de llevar la carga entera por sí solo. N+1 aguanta un fallo con poco gasto; 2N aguanta la pérdida de un conjunto entero, pero cuesta el doble. Son términos de práctica de diseño, sin una cifra normativa detrás. Además, las piezas dobladas pueden trabajar de dos maneras, que la documentación de Microsoft sobre clústeres de conmutación por error describe así: en **activo-activo** (*active-active*) todos los nodos trabajan a la vez y se reparten la carga, y se aprovechan mejor los recursos; en **activo-pasivo** (*active-passive*) unos nodos trabajan y otros esperan para relevarlos, lo que desaprovecha equipo pero es más sencillo y predecible.',
    },
    {
      t: 'table',
      headers: ['Concepto', 'Qué es', 'Fuente'],
      rows: [
        ['**Clúster** (*cluster*)', 'Grupo de servidores (nodos) que se presentan como un solo servicio y se vigilan entre sí', 'Práctica general; sin fuente normativa'],
        ['**Latido** (*heartbeat*)', 'Señal periódica con la que los nodos comprueban que los demás siguen vivos; a menudo viaja por una red privada dedicada', 'Microsoft, «Failover clustering overview»'],
        ['**Conmutación por error** (*failover*)', 'Paso automático del servicio a otro nodo cuando el latido revela un problema', 'Microsoft, «Failover clustering overview»'],
        ['**Vuelta** (*failback*)', 'Regreso del servicio al nodo original cuando se recupera; puede ser automática o manual', 'Práctica de diseño; sin cifra normativa'],
        ['**Activo-activo**', 'Todos los nodos trabajan y se reparten la carga', 'Microsoft, «Failover clustering overview»'],
        ['**Activo-pasivo**', 'Unos nodos trabajan y otros esperan para relevarlos', 'Microsoft, «Failover clustering overview»'],
        ['**N+1** / **2N**', 'Uno de reserva sobre lo necesario / todo duplicado', 'Práctica de diseño; sin cifra normativa'],
      ],
    },
    {
      t: 'p',
      md: 'Lo mismo pasa en la red y ya se ha visto en otras lecciones. **VRRP** (RFC 9568, que obsoleta la 5798) es un activo-pasivo de puertas de enlace: el **encaminador activo** (*Active Router*, el que la RFC 5798 llamaba *Master*) anuncia su presencia cada segundo por defecto, y los de respaldo lo dan por muerto cuando pasa el `Active_Down_Interval` sin oírlo; con el intervalo y la prioridad por defecto (100) eso son unos **3,61 s** según las fórmulas del §6.1. Es un latido con otro nombre. Y la vuelta también tiene su equivalente: con `Preempt_Mode` a *True*, su valor por defecto, un encaminador de más prioridad recupera el papel al volver. La agregación de enlaces con LACP (*Link Aggregation Control Protocol*, protocolo de control de agregación de enlaces) y la conmutación por error de DHCP son otras dos formas de redundancia que se explican en sus lecciones.',
    },
    {
      t: 'check',
      q: {
        q: 'Una sala necesita tres equipos de climatización para disipar su carga. El diseño instala cuatro, que funcionan a la vez, de modo que puede fallar cualquiera y los otros tres bastan. ¿Cómo se llama esa redundancia?',
        choices: [
          '2N',
          'Activo-pasivo',
          'N+1',
          'Paralelo con quórum',
        ],
        answer: 2,
        explain:
          'Hacen falta N = 3 y se pone uno más: N+1. 2N serían seis equipos, dos conjuntos completos de tres. Activo-pasivo describe cómo trabajan las piezas (unas esperan), y aquí las cuatro funcionan a la vez; el quórum es un mecanismo de los clústeres, no una forma de dimensionar.',
      },
    },
    { t: 'h', text: 'Quórum, testigo y cerebro dividido' },
    {
      t: 'p',
      md: 'El latido tiene un punto débil: si deja de llegar, un nodo no puede saber si el otro **ha muerto** o si solo se ha cortado **el camino** entre los dos. Si se equivoca y los dos siguen vivos, cada uno cree que el otro ha caído y ambos pueden ponerse a dar servicio a la vez: es el **cerebro dividido** (*split-brain*). Los dos responden por la misma dirección, los dos escriben en los mismos datos y el resultado es peor que una caída limpia. La defensa clásica es el **quórum** (*quorum*): según la documentación de Microsoft, el clúster solo sigue en línea si reúne un mínimo de votos, normalmente **más de la mitad** de los nodos. Tras una partición de la red, solo uno de los trozos puede tener mayoría, así que solo uno sigue funcionando.',
    },
    {
      t: 'p',
      md: 'La mayoría funciona limpia con un número **impar** de votos. Con dos nodos no hay forma de desempatar, y por eso existe el **testigo** (*witness*): un tercer voto que no es un nodo. Microsoft lo explica con dos nodos y un testigo, tres votos en total: si cae uno de los nodos, el superviviente reúne **2 de 3** y sigue. Sin testigo, con dos nodos, si cae el nodo que tiene el voto el clúster entero cae; por eso **Microsoft recomienda configurar siempre un testigo**. Con un número par de nodos y sin testigo, Windows anula el voto de uno de ellos, y con el **quórum dinámico** recalcula la mayoría entre los supervivientes tras cada caída. Los tipos de testigo que documenta Microsoft son tres: **testigo en la nube** (*cloud witness*, en Azure Storage, por el puerto **443**), **testigo de disco** (*disk witness*, un disco compartido) y **testigo de recurso compartido de archivos** (*file share witness*, por SMB, *Server Message Block*, versión 2 o superior, con al menos **5 MB** libres y sin admitir el sistema de archivos distribuido de Windows). Todos estos valores son del fabricante, Microsoft.',
    },
    {
      t: 'check',
      q: {
        q: 'Un clúster de Windows Server tiene dos nodos y un testigo de recurso compartido de archivos. Se apaga uno de los nodos por una avería. Según la documentación de Microsoft, ¿qué pasa?',
        choices: [
          'El clúster se detiene, porque ha perdido la mitad de sus nodos',
          'El superviviente reúne 2 de los 3 votos, tiene mayoría y el clúster sigue en línea',
          'Los dos nodos siguen dando servicio por separado hasta que vuelve el averiado',
          'El testigo pasa a dar el servicio en lugar del nodo caído',
        ],
        answer: 1,
        explain:
          'Dos nodos más el testigo suman tres votos; con un nodo caído quedan dos de tres, más de la mitad, y el clúster sigue. La primera opción describe lo que podría pasar sin testigo si el nodo caído fuera el que conserva el voto, que es justo lo que el testigo evita. Dos nodos dando servicio por separado sería el cerebro dividido, y el testigo solo vota: no ejecuta el servicio.',
      },
    },
    { t: 'h', text: 'El caso del Consorcio' },
    {
      t: 'p',
      md: 'El Consorcio publica su web informativa (`www.arcedo.example`) y su sede electrónica (`sede.arcedo.example`) a través de una sola dirección pública, `203.0.113.10`, que le da su único operador. El encaminador reenvía el puerto 443 de esa dirección a la **VIP** (*virtual IP*, dirección IP virtual) `10.20.72.70`, que comparten dos balanceadores del CPD (centro de proceso de datos), dos ADC (*Application Delivery Controller*, controlador de entrega de aplicaciones) llamados **ADC1** (`10.20.72.71`) y **ADC2** (`10.20.72.72`). La pareja es **activo-pasivo**: uno atiende la VIP y el otro espera, con el protocolo de alta disponibilidad de su fabricante y un **enlace de latido directo** entre los dos. Detrás, cada servicio tiene dos servidores: WEB1 y WEB2 para la web, SEDE1 y SEDE2 para la sede. Cómo reparte y comprueba el balanceador lo cuentan las lecciones siguientes; aquí interesa lo que pasa cuando algo se rompe.',
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'Si se corta el enlace de latido',
      md: 'Imagina que se suelta el cable del latido entre ADC1 y ADC2 y los dos siguen encendidos. ADC2, el pasivo, deja de oír a ADC1 y no tiene forma de saber si ha muerto o si solo se ha cortado el cable. Si concluye que ha muerto, toma la VIP `10.20.72.70`, y ahora **dos equipos responden por la misma dirección**: las conexiones pueden acabar repartidas entre los dos según quién conteste antes, las sesiones de la sede electrónica pueden romperse y el servicio puede quedar peor que con uno solo. Es el cerebro dividido con una pareja de dos y sin desempate. Cómo lo evita cada producto es cosa de su fabricante; la idea de esta lección es **un tercer voto** que desempate cuando los dos dejan de verse (el testigo de Microsoft); y, como práctica de diseño sin fuente normativa, no fiar el latido a un solo cable.',
    },
    {
      t: 'p',
      md: 'La pareja de balanceadores es redundante, pero no lo es todo lo que hay a su alrededor. El Consorcio tiene **un solo operador** y **una sola dirección pública**: una avería de la línea deja fuera a la vez la web y la sede, por muchos balanceadores que haya detrás. Y el CPD está **en el propio edificio de la sede central**, sin CPD de respaldo: un corte de luz prolongado o un incendio en ese edificio para todos los servicios a la vez. Las dos parejas, ADC y servidores, comparten sala y línea, y con un solo CPD también comparten edificio y suministro, así que el cálculo en paralelo del ejemplo resuelto sobrestima su disponibilidad real. Montar un CPD de respaldo en otro edificio sería la forma de quitar ese punto único de fallo, pero hoy es solo un **supuesto**, no algo que el Consorcio tenga.',
    },
    {
      t: 'p',
      md: 'Una última precisión normativa: el ENS (Esquema Nacional de Seguridad) **no** fija porcentajes de disponibilidad ni «nueves». Sus medidas de continuidad del servicio (`op.cont.1` a `op.cont.4`: análisis de impacto, plan de continuidad, pruebas periódicas y medios alternativos) se aplican según el nivel de la dimensión de disponibilidad, y `op.cont.4` pide fijar un tiempo máximo para que entren en servicio los medios alternativos, sin dar ninguna cifra. Las cifras las decide cada organización.',
    },
    {
      t: 'check',
      q: {
        q: 'El Consorcio quiere subir de verdad la disponibilidad de su sede electrónica. Ya tiene dos balanceadores y dos servidores en el CPD de la sede central, con un solo operador. ¿Qué cambio ataca el punto único de fallo que más pesa?',
        choices: [
          'Añadir un tercer balanceador en el mismo CPD que ADC1 y ADC2',
          'Pasar la pareja de balanceadores de activo-pasivo a activo-activo',
          'Añadir un tercer servidor SEDE3 en el mismo CPD',
          'Añadir una segunda salida a Internet que no dependa de la única línea del operador',
        ],
        answer: 3,
        explain:
          'La línea está en serie con todo lo demás y no tiene doble: su avería tumba la web y la sede a la vez, por mucha redundancia que haya detrás. Un tercer balanceador o un tercer servidor en el mismo CPD añaden paralelo donde ya lo hay y no resuelven nada si cae la línea. Pasar a activo-activo cambia cómo se reparte la carga, no elimina ningún punto único de fallo.',
      },
    },
    {
      t: 'links',
      title: 'Lo que ya está explicado en otras lecciones',
      items: [
        { label: 'VRRP y HSRP: redundancia de la puerta de enlace (lección op1m4)', href: '/learn/op1m4' },
        { label: 'Agregación de enlaces con LACP (lección op1m3)', href: '/learn/op1m3' },
        { label: 'Conmutación por error de DHCP (lección op3m3)', href: '/learn/op3m3' },
        { label: 'Resiliencia y recuperación: alta disponibilidad, sitios de respaldo, RTO y RPO (lección sp3m7 de Security+)', href: '/learn/sp3m7' },
        { label: 'Las medidas de continuidad del servicio op.cont del ENS (lección op6m3)', href: '/learn/op6m3' },
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Lo que más se confunde',
      md: '**Nueves:** cada nueve divide la parada entre diez; 99,9 % son **8 h 45 min 36 s al año** pero **43 min 12 s al mes** (año de 365 días, mes de 30). **Fórmula:** disponibilidad = **MTBF / (MTBF + MTTR)**, tal como la da AWS Well-Architected; MTTR admite varias lecturas, así que se define cada vez. **Serie:** se multiplican disponibilidades y el total baja por debajo de la pieza más débil. **Paralelo:** se multiplican **indisponibilidades** y el total sube, pero solo si los fallos son independientes. **N+1** es uno de reserva; **2N**, todo duplicado. **Activo-activo** reparte la carga; **activo-pasivo** deja nodos esperando. **Quórum:** más de la mitad de los votos; con dos nodos hace falta un **testigo** (Microsoft recomienda configurarlo siempre). **Cerebro dividido:** los dos nodos vivos creen que el otro ha muerto y los dos sirven a la vez. **VRRP** (RFC 9568) ya no dice *Master* sino **Active Router**. **ENS:** no fija nueves.',
    },
  ],
  quiz: [
    {
      id: 'op4m1q1',
      domain: 'Balanceo y alta disponibilidad',
      prompt: 'Un servicio tiene una disponibilidad anual del 99,99 %. Contando un año de 365 días, ¿cuánto tiempo de parada admite al año?',
      choices: [
        '5 min 15,4 s',
        '8 h 45 min 36 s',
        '52 min 33,6 s',
        '4 min 19,2 s',
      ],
      answer: 2,
      explain:
        '(1 − 0,9999) × 525 600 min = 52,56 min, es decir, 52 min 33,6 s. Los 4 min 19,2 s son la parada de cuatro nueves en un mes de 30 días, no en un año: la trampa es la base de tiempo. 5 min 15,4 s corresponden a cinco nueves al año y 8 h 45 min 36 s, a tres nueves.',
    },
    {
      id: 'op4m1q2',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Un equipo tiene un MTBF (tiempo medio entre fallos) de 1999 horas y un MTTR de 1 hora, entendido como tiempo medio hasta recuperar el servicio. Con la fórmula de AWS Well-Architected, ¿qué disponibilidad estimada tiene?',
      choices: [
        '99,9 %',
        '99,95 %',
        '99,995 %',
        '99,5 %',
      ],
      answer: 1,
      explain:
        'MTBF / (MTBF + MTTR) = 1999 / 2000 = 0,9995, un 99,95 %, que equivale a 4 h 22 min 48 s de parada en un año de 365 días. El 99,995 % saldría con un MTBF de 19 999 horas, y el 99,5 % con uno de 199. El 99,9 % tienta por redondeo, pero 1999 / 2000 no es 999 / 1000.',
    },
    {
      id: 'op4m1q3',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Un servicio depende a la vez de tres componentes, cada uno con un 99,99 % de disponibilidad; si cualquiera falla, el servicio cae. Suponiendo fallos independientes, ¿qué disponibilidad tiene el servicio?',
      choices: [
        '99,99 %, la de cada componente',
        '99,999999 %',
        '99,9999999999 %',
        '99,97 %',
      ],
      answer: 3,
      explain:
        'Son dependencias en serie: se multiplican las disponibilidades, 0,9999³ = 0,99970003, un 99,97 % (el ejemplo de AWS Well-Architected). Quedarse en el 99,99 % de cada pieza es el error típico: una cadena siempre queda por debajo de su pieza más débil. Las otras dos cifras salen de tratarlos como si estuvieran en paralelo: dos en paralelo darían 1 − 0,0001² = 99,999999 % y tres, 1 − 0,0001³ = 99,9999999999 %.',
    },
    {
      id: 'op4m1q4',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Dos servidores redundantes e independientes, cada uno con un 99,9 % de disponibilidad, atienden un servicio que sigue funcionando mientras quede uno vivo. ¿Qué disponibilidad tiene el conjunto?',
      choices: [
        '99,9999 %',
        '99,8001 %',
        '99,95 %',
        '99,9 %',
      ],
      answer: 0,
      explain:
        'En paralelo se multiplican las indisponibilidades: 1 − (0,001 × 0,001) = 0,999999, seis nueves; el atajo de AWS es sumar los nueves, 3 + 3 = 6. El 99,8001 % es el resultado de multiplicar las disponibilidades, que corresponde a dos piezas en serie, justo lo contrario. Ni la media ni la cifra de un solo servidor reflejan la redundancia.',
    },
    {
      id: 'op4m1q5',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Un clúster de conmutación por error de Windows Server tiene dos nodos y ningún testigo. Según la documentación de Microsoft sobre el quórum, ¿qué recomendación corresponde y por qué?',
      choices: [
        'Ninguna: con dos nodos ya hay mayoría si cae cualquiera de ellos',
        'Añadir un tercer enlace de latido, porque el quórum se cuenta en enlaces y no en votos',
        'Configurar un testigo, que añade un tercer voto: si cae un nodo, el superviviente reúne 2 de 3 y el clúster sigue',
        'Desactivar el quórum, porque con dos nodos provoca el cerebro dividido',
      ],
      answer: 2,
      explain:
        'Microsoft recomienda configurar siempre un testigo: con dos nodos y testigo hay tres votos, y el superviviente de una caída conserva mayoría. Sin testigo, uno de dos no es más de la mitad, y si cae el nodo que vota el clúster cae, así que la primera opción es falsa. El quórum se cuenta en votos, no en enlaces, y es precisamente lo que evita el cerebro dividido, no lo que lo provoca.',
    },
    {
      id: 'op4m1q6',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'En el CPD del Consorcio, ADC1 y ADC2 forman una pareja activo-pasivo que comparte la VIP 10.20.72.70 y se vigila por un enlace de latido directo. Se corta ese enlace y los dos equipos siguen encendidos. ¿Qué riesgo aparece?',
      choices: [
        'Ninguno: el pasivo detecta que el activo sigue vivo por la propia VIP y no hace nada',
        'Cerebro dividido: el pasivo puede concluir que el activo ha muerto, tomar la VIP y dejar a los dos respondiendo por la misma dirección',
        'Que el encaminador deje de reenviar el puerto 443 de 203.0.113.10',
        'Que WEB1 y WEB2 se conviertan en un clúster activo-activo',
      ],
      answer: 1,
      explain:
        'Sin latido, el pasivo no distingue entre un compañero muerto y un cable cortado; si toma la VIP con el activo aún vivo, dos equipos responden por 10.20.72.70: es el cerebro dividido. La primera opción supone una comprobación que el enlace de latido existe precisamente para hacer. El reenvío del encaminador y los servidores de detrás no cambian por un corte entre los balanceadores.',
    },
    {
      id: 'op4m1q7',
      domain: 'Balanceo y alta disponibilidad',
      prompt: 'Según la documentación de Microsoft sobre clústeres de conmutación por error, ¿qué describe un clúster activo-pasivo frente a uno activo-activo?',
      choices: [
        'En activo-pasivo todos los nodos trabajan a la vez y se reparten la carga',
        'En activo-pasivo no hace falta latido, porque el nodo de espera no da servicio',
        'Activo-pasivo y activo-activo solo se diferencian en el número de nodos',
        'En activo-pasivo unos nodos trabajan y otros esperan para relevarlos: desaprovecha equipo, pero es más sencillo y predecible',
      ],
      answer: 3,
      explain:
        'Microsoft describe el activo-pasivo como nodos activos más nodos en espera, menos eficiente pero más simple y predecible. La primera opción es la definición de activo-activo, que es la confusión que se busca. El nodo en espera necesita el latido precisamente para saber cuándo relevar, y la diferencia está en cómo trabajan los nodos, no en cuántos son.',
    },
    {
      id: 'op4m1q8',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Un informe calcula que la pareja ADC1/ADC2 del Consorcio, con cada equipo al 99,9 %, alcanza un 99,9999 % por estar en paralelo. Los dos están en la misma sala del CPD de la sede central y detrás de la única línea del operador. ¿Qué objeción es correcta?',
      choices: [
        'El cálculo en paralelo supone fallos independientes; un corte de luz en la sala o una avería de la línea tumba a los dos a la vez, así que la cifra real es menor',
        'La cuenta está mal: dos equipos al 99,9 % en paralelo dan un 99,8001 %',
        'La cifra es correcta, porque la sala y la línea no forman parte del balanceador',
        'Un par activo-pasivo nunca puede estar en paralelo: solo el activo-activo lo está',
      ],
      answer: 0,
      explain:
        'La aritmética es correcta, 1 − 0,001² = 0,999999, pero descansa en que los dos equipos fallen por causas distintas; compartir sala y línea rompe esa hipótesis. El 99,8001 % es el resultado en serie, no en paralelo. Y en paralelo está cualquier redundancia en la que basta una pieza viva, sea activo-activo o activo-pasivo.',
    },
  ],
};
