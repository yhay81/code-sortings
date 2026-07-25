export const SUPPORTED_LOCALES = [
  { code: "ja", label: "日本語" },
  { code: "en", label: "English" },
  { code: "zh-CN", label: "简体中文" },
  { code: "es", label: "Español" },
  { code: "pt-BR", label: "Português" },
  { code: "ko", label: "한국어" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number]["code"];

const japanese = {
  "meta.description":
    "普通のPythonで書いたソートアルゴリズムを、一行ずつ見て学べるビジュアライザー",
  "brand.home": "Code Sortings ホーム",
  "locale.label": "表示言語",
  "engine.preparing": "Pythonを準備中",
  "engine.ready": "Python 準備完了",
  "engine.running": "コードを実行中",
  "engine.failed": "Pythonの準備に失敗",
  "settings.label": "実行設定",
  "field.algorithm": "アルゴリズム",
  "field.pattern": "入力パターン",
  "field.length": "要素数",
  "pattern.random": "ランダム",
  "pattern.nearlySorted": "ほぼ整列済み",
  "pattern.reversed": "逆順",
  "pattern.fewUnique": "重複が多い",
  "patternHint.random":
    "平均的な動きを眺めるのに向いた、順序に偏りのない入力です。",
  "patternHint.nearlySorted":
    "すでに近い位置にある値をどう扱うか見えます。挿入ソートの得意な入力です。",
  "patternHint.reversed":
    "多くの単純な手法で交換が増えます。最悪時の動きを探るのに向いています。",
  "patternHint.fewUnique":
    "同じ値をどう扱うか見えます。比較条件と安定性を考えるきっかけになります。",
  "action.run": "実行",
  "editor.label": "Pythonソートコード",
  "source.waiting": "実行待ち",
  "source.before": "実行前",
  "source.line": "{function}() · {line}行目",
  "metrics.label": "実行メトリクス",
  "metrics.comparisons": "比較",
  "metrics.frames": "フレーム",
  "timeline.label": "タイムライン",
  "transport.label": "再生操作",
  "transport.first": "先頭",
  "transport.firstTitle": "先頭へ",
  "transport.back": "戻る",
  "transport.backTitle": "1コマ戻る",
  "transport.play": "再生",
  "transport.playTitle": "再生（Space）",
  "transport.pause": "一時停止",
  "transport.pauseTitle": "一時停止（Space）",
  "transport.stop": "停止",
  "transport.forward": "進む",
  "transport.forwardTitle": "1コマ進む",
  "speed.label": "速さ",
  "speed.slow": "ゆっくり",
  "speed.normal": "ふつう",
  "speed.fast": "はやい",
  "status.enginePreparing": "Pythonエンジンを準備しています…",
  "status.executing": "Pythonコードを実行しています…",
  "status.valuesChanged":
    "実行は完了しましたが、元の配列と値の構成が変わっています",
  "status.notSorted":
    "実行は完了しましたが、配列は昇順になっていません（Python {version}）",
  "status.sampled": " · {steps}操作から間引き",
  "status.complete": "実行完了 · {frames}フレーム{sampling} · Python {version}",
  "error.loadExample": "例コードの読み込みに失敗しました",
  "error.visualizationTitle": "コードを実行できませんでした",
  "error.visualizationDetail":
    "エラーの内容を確認して、コードを修正してください。",
  "lesson.algorithm": "アルゴリズム",
  "lesson.complexity": "計算量",
  "lesson.best": "最良",
  "lesson.average": "平均",
  "lesson.worst": "最悪",
  "lesson.trait": "特徴",
  "lesson.focus": "見るポイント",
  "operation.mark.kind": "位置を確定",
  "operation.mark.title": "{indices}{suffix} を整列済みにしました",
  "operation.mark.more": "ほか{count}件",
  "operation.swap.kind": "値を交換",
  "operation.swap.title": "array[{left}] と array[{right}] を交換しました",
  "operation.write.kind": "値を書き換え",
  "operation.write.one": "array[{index}] を更新しました",
  "operation.write.many": "{count}か所を更新しました",
  "operation.compare.kind": "値を比較",
  "operation.compare.title":
    "array[{left}] と array[{right}] を「{operator}」で比較",
  "operation.compare.fallback": "比較",
  "operation.read.kind": "値を読む",
  "operation.read.title": "array[{index}] から {value} を読み取りました",
  "operation.advance.kind": "コードを進める",
  "operation.advance.title": "{function}() の {line}行目を実行しました",
  "operation.advance.noChange": "この行では配列の値は変わりません",
  "operation.start.kind": "開始位置",
  "operation.start.title": "実行前の配列です",
  "operation.start.detail":
    "再生するか、タイムラインを動かして変化を追ってみましょう",
  "operation.boot.detail":
    "Pythonの準備ができると、自動で最初のコードを実行します。",
  "chart.label": "ソート配列。比較 {comparisons} 回、{frame} フレーム目",
  "chart.title": "配列: {values}",
  "runner.cancelled": "新しい実行を開始しました",
  "runner.stopped": "実行を停止しました",
  "runner.timeout": "実行が {seconds} 秒を超えたため停止しました",
  "runner.bootTimeout": "Pythonエンジンの起動がタイムアウトしました",
  "runnerError.finite": "配列には有限の数値だけを代入できます",
  "runnerError.fixedLength": "ソート中に配列の長さを変更することはできません",
  "runnerError.inputLength": "配列の長さは3〜300にしてください",
  "runnerError.defineSort": "def sort(array): を定義してください",
  "runnerError.load": "Pythonランナーを読み込めませんでした",
  "runnerError.notReady": "Pythonエンジンの準備が完了していません",
  "runnerError.traceLimit": "可視化ステップ数が上限の {steps} を超えました",
} as const;

export type TranslationKey = keyof typeof japanese;

const english: Record<TranslationKey, string> = {
  "meta.description":
    "A visualizer for learning sorting algorithms written in ordinary Python, one line at a time",
  "brand.home": "Code Sortings home",
  "locale.label": "Display language",
  "engine.preparing": "Preparing Python",
  "engine.ready": "Python ready",
  "engine.running": "Running code",
  "engine.failed": "Python failed to start",
  "settings.label": "Run settings",
  "field.algorithm": "Algorithm",
  "field.pattern": "Input pattern",
  "field.length": "Items",
  "pattern.random": "Random",
  "pattern.nearlySorted": "Nearly sorted",
  "pattern.reversed": "Reversed",
  "pattern.fewUnique": "Few unique",
  "patternHint.random":
    "An unbiased input that is useful for observing typical behavior.",
  "patternHint.nearlySorted":
    "Shows how values already near their destination are handled. Insertion Sort excels here.",
  "patternHint.reversed":
    "Many simple methods perform more swaps here. Use it to explore worst-case behavior.",
  "patternHint.fewUnique":
    "Shows how equal values are handled and invites questions about comparisons and stability.",
  "action.run": "Run",
  "editor.label": "Python sorting code",
  "source.waiting": "Waiting to run",
  "source.before": "Before run",
  "source.line": "{function}() · line {line}",
  "metrics.label": "Run metrics",
  "metrics.comparisons": "Comparisons",
  "metrics.frames": "Frame",
  "timeline.label": "Timeline",
  "transport.label": "Playback controls",
  "transport.first": "First",
  "transport.firstTitle": "Go to first frame",
  "transport.back": "Back",
  "transport.backTitle": "Back one frame",
  "transport.play": "Play",
  "transport.playTitle": "Play (Space)",
  "transport.pause": "Pause",
  "transport.pauseTitle": "Pause (Space)",
  "transport.stop": "Stop",
  "transport.forward": "Next",
  "transport.forwardTitle": "Forward one frame",
  "speed.label": "Speed",
  "speed.slow": "Slow",
  "speed.normal": "Normal",
  "speed.fast": "Fast",
  "status.enginePreparing": "Preparing the Python engine…",
  "status.executing": "Running Python code…",
  "status.valuesChanged":
    "Run complete, but the values in the original array were changed",
  "status.notSorted":
    "Run complete, but the array is not in ascending order (Python {version})",
  "status.sampled": " · sampled from {steps} operations",
  "status.complete": "Complete · {frames} frames{sampling} · Python {version}",
  "error.loadExample": "Could not load the example code",
  "error.visualizationTitle": "The code could not be run",
  "error.visualizationDetail":
    "Review the error, then edit the code and retry.",
  "lesson.algorithm": "Algorithm",
  "lesson.complexity": "Complexity",
  "lesson.best": "Best",
  "lesson.average": "Average",
  "lesson.worst": "Worst",
  "lesson.trait": "Traits",
  "lesson.focus": "What to watch",
  "operation.mark.kind": "Position settled",
  "operation.mark.title": "Marked {indices}{suffix} as sorted",
  "operation.mark.more": " and {count} more",
  "operation.swap.kind": "Swap values",
  "operation.swap.title": "Swapped array[{left}] and array[{right}]",
  "operation.write.kind": "Write value",
  "operation.write.one": "Updated array[{index}]",
  "operation.write.many": "Updated {count} positions",
  "operation.compare.kind": "Compare values",
  "operation.compare.title":
    "Compared array[{left}] and array[{right}] with “{operator}”",
  "operation.compare.fallback": "compare",
  "operation.read.kind": "Read value",
  "operation.read.title": "Read {value} from array[{index}]",
  "operation.advance.kind": "Advance code",
  "operation.advance.title": "Ran line {line} of {function}()",
  "operation.advance.noChange": "This line does not change any array values",
  "operation.start.kind": "Starting point",
  "operation.start.title": "This is the array before execution",
  "operation.start.detail":
    "Press Play or move the timeline to follow each change.",
  "operation.boot.detail":
    "The first example will run automatically when Python is ready.",
  "chart.label": "Sorting array. {comparisons} comparisons, frame {frame}",
  "chart.title": "Array: {values}",
  "runner.cancelled": "Started a new run",
  "runner.stopped": "Run stopped",
  "runner.timeout": "Stopped after the run exceeded {seconds} seconds",
  "runner.bootTimeout": "The Python engine timed out while starting",
  "runnerError.finite": "Only finite numbers can be assigned to the array",
  "runnerError.fixedLength": "The array length cannot be changed while sorting",
  "runnerError.inputLength": "The array length must be between 3 and 300",
  "runnerError.defineSort": "Define def sort(array): first",
  "runnerError.load": "The Python runner could not be loaded",
  "runnerError.notReady": "The Python engine is not ready",
  "runnerError.traceLimit": "The visualization exceeded its {steps}-step limit",
};

const chineseSimplified: Record<TranslationKey, string> = {
  "meta.description": "逐行可视化并学习用普通 Python 编写的排序算法",
  "brand.home": "Code Sortings 首页",
  "locale.label": "显示语言",
  "engine.preparing": "正在准备 Python",
  "engine.ready": "Python 已就绪",
  "engine.running": "正在运行代码",
  "engine.failed": "Python 启动失败",
  "settings.label": "运行设置",
  "field.algorithm": "算法",
  "field.pattern": "输入模式",
  "field.length": "元素数",
  "pattern.random": "随机",
  "pattern.nearlySorted": "接近有序",
  "pattern.reversed": "逆序",
  "pattern.fewUnique": "少量不同值",
  "patternHint.random": "没有明显顺序偏差，适合观察一般情况下的运行方式。",
  "patternHint.nearlySorted":
    "可以观察算法如何处理已接近目标位置的值。插入排序很擅长这种输入。",
  "patternHint.reversed":
    "许多简单算法会在这里产生更多交换，适合探索最坏情况。",
  "patternHint.fewUnique": "可以观察相同值的处理方式，并思考比较条件与稳定性。",
  "action.run": "运行",
  "editor.label": "Python 排序代码",
  "source.waiting": "等待运行",
  "source.before": "运行前",
  "source.line": "{function}() · 第 {line} 行",
  "metrics.label": "运行指标",
  "metrics.comparisons": "比较",
  "metrics.frames": "帧",
  "timeline.label": "时间轴",
  "transport.label": "播放控制",
  "transport.first": "开头",
  "transport.firstTitle": "回到第一帧",
  "transport.back": "后退",
  "transport.backTitle": "后退一帧",
  "transport.play": "播放",
  "transport.playTitle": "播放（Space）",
  "transport.pause": "暂停",
  "transport.pauseTitle": "暂停（Space）",
  "transport.stop": "停止",
  "transport.forward": "前进",
  "transport.forwardTitle": "前进一帧",
  "speed.label": "速度",
  "speed.slow": "慢",
  "speed.normal": "正常",
  "speed.fast": "快",
  "status.enginePreparing": "正在准备 Python 引擎…",
  "status.executing": "正在运行 Python 代码…",
  "status.valuesChanged": "运行完成，但原数组中的值发生了变化",
  "status.notSorted": "运行完成，但数组未按升序排列（Python {version}）",
  "status.sampled": " · 从 {steps} 次操作中采样",
  "status.complete": "完成 · {frames} 帧{sampling} · Python {version}",
  "error.loadExample": "无法加载示例代码",
  "error.visualizationTitle": "无法运行代码",
  "error.visualizationDetail": "请检查错误信息，修改代码后重试。",
  "lesson.algorithm": "算法",
  "lesson.complexity": "复杂度",
  "lesson.best": "最好",
  "lesson.average": "平均",
  "lesson.worst": "最坏",
  "lesson.trait": "特性",
  "lesson.focus": "观察重点",
  "operation.mark.kind": "确定位置",
  "operation.mark.title": "已将 {indices}{suffix} 标记为有序",
  "operation.mark.more": "及其他 {count} 项",
  "operation.swap.kind": "交换值",
  "operation.swap.title": "交换了 array[{left}] 与 array[{right}]",
  "operation.write.kind": "写入值",
  "operation.write.one": "更新了 array[{index}]",
  "operation.write.many": "更新了 {count} 个位置",
  "operation.compare.kind": "比较值",
  "operation.compare.title":
    "使用“{operator}”比较 array[{left}] 与 array[{right}]",
  "operation.compare.fallback": "比较",
  "operation.read.kind": "读取值",
  "operation.read.title": "从 array[{index}] 读取了 {value}",
  "operation.advance.kind": "执行代码",
  "operation.advance.title": "执行了 {function}() 的第 {line} 行",
  "operation.advance.noChange": "这一行不会改变数组中的值",
  "operation.start.kind": "起始位置",
  "operation.start.title": "这是运行前的数组",
  "operation.start.detail": "点击播放或拖动时间轴，逐步观察变化。",
  "operation.boot.detail": "Python 就绪后会自动运行第一个示例。",
  "chart.label": "排序数组。已比较 {comparisons} 次，当前第 {frame} 帧",
  "chart.title": "数组：{values}",
  "runner.cancelled": "已开始新的运行",
  "runner.stopped": "运行已停止",
  "runner.timeout": "运行超过 {seconds} 秒，已停止",
  "runner.bootTimeout": "Python 引擎启动超时",
  "runnerError.finite": "数组中只能写入有限数值",
  "runnerError.fixedLength": "排序过程中不能改变数组长度",
  "runnerError.inputLength": "数组长度必须在 3 到 300 之间",
  "runnerError.defineSort": "请先定义 def sort(array):",
  "runnerError.load": "无法加载 Python 运行器",
  "runnerError.notReady": "Python 引擎尚未就绪",
  "runnerError.traceLimit": "可视化超过了 {steps} 步的上限",
};

const spanish: Record<TranslationKey, string> = {
  "meta.description":
    "Visualiza y aprende, línea por línea, algoritmos de ordenación escritos en Python normal",
  "brand.home": "Inicio de Code Sortings",
  "locale.label": "Idioma de la interfaz",
  "engine.preparing": "Preparando Python",
  "engine.ready": "Python listo",
  "engine.running": "Ejecutando código",
  "engine.failed": "No se pudo iniciar Python",
  "settings.label": "Ajustes de ejecución",
  "field.algorithm": "Algoritmo",
  "field.pattern": "Patrón de entrada",
  "field.length": "Elementos",
  "pattern.random": "Aleatorio",
  "pattern.nearlySorted": "Casi ordenado",
  "pattern.reversed": "Invertido",
  "pattern.fewUnique": "Pocos valores",
  "patternHint.random":
    "Una entrada sin sesgo de orden, útil para observar el comportamiento habitual.",
  "patternHint.nearlySorted":
    "Muestra cómo se tratan los valores que ya están cerca de su destino. Insertion Sort destaca aquí.",
  "patternHint.reversed":
    "Muchos métodos simples realizan más intercambios. Úsalo para explorar el peor caso.",
  "patternHint.fewUnique":
    "Muestra cómo se tratan los valores iguales y ayuda a pensar en comparaciones y estabilidad.",
  "action.run": "Ejecutar",
  "editor.label": "Código Python de ordenación",
  "source.waiting": "Esperando ejecución",
  "source.before": "Antes de ejecutar",
  "source.line": "{function}() · línea {line}",
  "metrics.label": "Métricas de ejecución",
  "metrics.comparisons": "Comparaciones",
  "metrics.frames": "Fotograma",
  "timeline.label": "Línea de tiempo",
  "transport.label": "Controles de reproducción",
  "transport.first": "Inicio",
  "transport.firstTitle": "Ir al primer fotograma",
  "transport.back": "Atrás",
  "transport.backTitle": "Retroceder un fotograma",
  "transport.play": "Reproducir",
  "transport.playTitle": "Reproducir (Space)",
  "transport.pause": "Pausar",
  "transport.pauseTitle": "Pausar (Space)",
  "transport.stop": "Detener",
  "transport.forward": "Siguiente",
  "transport.forwardTitle": "Avanzar un fotograma",
  "speed.label": "Velocidad",
  "speed.slow": "Lenta",
  "speed.normal": "Normal",
  "speed.fast": "Rápida",
  "status.enginePreparing": "Preparando el motor de Python…",
  "status.executing": "Ejecutando código Python…",
  "status.valuesChanged":
    "La ejecución terminó, pero cambiaron los valores del arreglo original",
  "status.notSorted":
    "La ejecución terminó, pero el arreglo no está en orden ascendente (Python {version})",
  "status.sampled": " · muestra de {steps} operaciones",
  "status.complete":
    "Completado · {frames} fotogramas{sampling} · Python {version}",
  "error.loadExample": "No se pudo cargar el código de ejemplo",
  "error.visualizationTitle": "No se pudo ejecutar el código",
  "error.visualizationDetail":
    "Revisa el error, modifica el código y vuelve a intentarlo.",
  "lesson.algorithm": "Algoritmo",
  "lesson.complexity": "Complejidad",
  "lesson.best": "Mejor",
  "lesson.average": "Promedio",
  "lesson.worst": "Peor",
  "lesson.trait": "Características",
  "lesson.focus": "Qué observar",
  "operation.mark.kind": "Posición resuelta",
  "operation.mark.title": "{indices}{suffix} quedó marcado como ordenado",
  "operation.mark.more": " y {count} más",
  "operation.swap.kind": "Intercambiar valores",
  "operation.swap.title": "Se intercambiaron array[{left}] y array[{right}]",
  "operation.write.kind": "Escribir valor",
  "operation.write.one": "Se actualizó array[{index}]",
  "operation.write.many": "Se actualizaron {count} posiciones",
  "operation.compare.kind": "Comparar valores",
  "operation.compare.title":
    "Se compararon array[{left}] y array[{right}] con «{operator}»",
  "operation.compare.fallback": "comparar",
  "operation.read.kind": "Leer valor",
  "operation.read.title": "Se leyó {value} de array[{index}]",
  "operation.advance.kind": "Avanzar código",
  "operation.advance.title": "Se ejecutó la línea {line} de {function}()",
  "operation.advance.noChange": "Esta línea no cambia ningún valor del arreglo",
  "operation.start.kind": "Punto inicial",
  "operation.start.title": "Este es el arreglo antes de ejecutar",
  "operation.start.detail":
    "Pulsa Reproducir o mueve la línea de tiempo para seguir cada cambio.",
  "operation.boot.detail":
    "El primer ejemplo se ejecutará automáticamente cuando Python esté listo.",
  "chart.label":
    "Arreglo en ordenación. {comparisons} comparaciones, fotograma {frame}",
  "chart.title": "Arreglo: {values}",
  "runner.cancelled": "Se inició una nueva ejecución",
  "runner.stopped": "Ejecución detenida",
  "runner.timeout": "La ejecución superó {seconds} segundos y fue detenida",
  "runner.bootTimeout": "El motor de Python agotó el tiempo de inicio",
  "runnerError.finite": "Solo se pueden asignar números finitos al arreglo",
  "runnerError.fixedLength":
    "No se puede cambiar la longitud del arreglo durante la ordenación",
  "runnerError.inputLength": "La longitud del arreglo debe estar entre 3 y 300",
  "runnerError.defineSort": "Define primero def sort(array):",
  "runnerError.load": "No se pudo cargar el ejecutor de Python",
  "runnerError.notReady": "El motor de Python aún no está listo",
  "runnerError.traceLimit":
    "La visualización superó el límite de {steps} pasos",
};

const portugueseBrazil: Record<TranslationKey, string> = {
  "meta.description":
    "Visualize e aprenda, linha por linha, algoritmos de ordenação escritos em Python comum",
  "brand.home": "Início do Code Sortings",
  "locale.label": "Idioma da interface",
  "engine.preparing": "Preparando Python",
  "engine.ready": "Python pronto",
  "engine.running": "Executando código",
  "engine.failed": "Falha ao iniciar o Python",
  "settings.label": "Configurações de execução",
  "field.algorithm": "Algoritmo",
  "field.pattern": "Padrão de entrada",
  "field.length": "Itens",
  "pattern.random": "Aleatório",
  "pattern.nearlySorted": "Quase ordenado",
  "pattern.reversed": "Invertido",
  "pattern.fewUnique": "Poucos valores",
  "patternHint.random":
    "Uma entrada sem tendência de ordem, útil para observar o comportamento típico.",
  "patternHint.nearlySorted":
    "Mostra como são tratados valores já próximos do destino. Insertion Sort se destaca aqui.",
  "patternHint.reversed":
    "Muitos métodos simples fazem mais trocas. Use para explorar o pior caso.",
  "patternHint.fewUnique":
    "Mostra como valores iguais são tratados e ajuda a pensar em comparações e estabilidade.",
  "action.run": "Executar",
  "editor.label": "Código Python de ordenação",
  "source.waiting": "Aguardando execução",
  "source.before": "Antes de executar",
  "source.line": "{function}() · linha {line}",
  "metrics.label": "Métricas da execução",
  "metrics.comparisons": "Comparações",
  "metrics.frames": "Quadro",
  "timeline.label": "Linha do tempo",
  "transport.label": "Controles de reprodução",
  "transport.first": "Início",
  "transport.firstTitle": "Ir para o primeiro quadro",
  "transport.back": "Voltar",
  "transport.backTitle": "Voltar um quadro",
  "transport.play": "Reproduzir",
  "transport.playTitle": "Reproduzir (Space)",
  "transport.pause": "Pausar",
  "transport.pauseTitle": "Pausar (Space)",
  "transport.stop": "Parar",
  "transport.forward": "Avançar",
  "transport.forwardTitle": "Avançar um quadro",
  "speed.label": "Velocidade",
  "speed.slow": "Lenta",
  "speed.normal": "Normal",
  "speed.fast": "Rápida",
  "status.enginePreparing": "Preparando o mecanismo Python…",
  "status.executing": "Executando código Python…",
  "status.valuesChanged":
    "A execução terminou, mas os valores do array original foram alterados",
  "status.notSorted":
    "A execução terminou, mas o array não está em ordem crescente (Python {version})",
  "status.sampled": " · amostra de {steps} operações",
  "status.complete":
    "Concluído · {frames} quadros{sampling} · Python {version}",
  "error.loadExample": "Não foi possível carregar o código de exemplo",
  "error.visualizationTitle": "Não foi possível executar o código",
  "error.visualizationDetail":
    "Revise o erro, edite o código e tente novamente.",
  "lesson.algorithm": "Algoritmo",
  "lesson.complexity": "Complexidade",
  "lesson.best": "Melhor",
  "lesson.average": "Média",
  "lesson.worst": "Pior",
  "lesson.trait": "Características",
  "lesson.focus": "O que observar",
  "operation.mark.kind": "Posição definida",
  "operation.mark.title": "{indices}{suffix} marcado como ordenado",
  "operation.mark.more": " e mais {count}",
  "operation.swap.kind": "Trocar valores",
  "operation.swap.title": "array[{left}] e array[{right}] foram trocados",
  "operation.write.kind": "Gravar valor",
  "operation.write.one": "array[{index}] foi atualizado",
  "operation.write.many": "{count} posições foram atualizadas",
  "operation.compare.kind": "Comparar valores",
  "operation.compare.title":
    "array[{left}] e array[{right}] foram comparados com “{operator}”",
  "operation.compare.fallback": "comparar",
  "operation.read.kind": "Ler valor",
  "operation.read.title": "Leitura de {value} em array[{index}]",
  "operation.advance.kind": "Avançar código",
  "operation.advance.title": "A linha {line} de {function}() foi executada",
  "operation.advance.noChange": "Esta linha não altera valores do array",
  "operation.start.kind": "Ponto inicial",
  "operation.start.title": "Este é o array antes da execução",
  "operation.start.detail":
    "Pressione Reproduzir ou mova a linha do tempo para acompanhar cada mudança.",
  "operation.boot.detail":
    "O primeiro exemplo será executado automaticamente quando o Python estiver pronto.",
  "chart.label":
    "Array em ordenação. {comparisons} comparações, quadro {frame}",
  "chart.title": "Array: {values}",
  "runner.cancelled": "Uma nova execução foi iniciada",
  "runner.stopped": "Execução interrompida",
  "runner.timeout":
    "A execução ultrapassou {seconds} segundos e foi interrompida",
  "runner.bootTimeout": "O mecanismo Python excedeu o tempo de inicialização",
  "runnerError.finite": "Apenas números finitos podem ser atribuídos ao array",
  "runnerError.fixedLength":
    "O tamanho do array não pode ser alterado durante a ordenação",
  "runnerError.inputLength": "O tamanho do array deve estar entre 3 e 300",
  "runnerError.defineSort": "Defina primeiro def sort(array):",
  "runnerError.load": "Não foi possível carregar o executor Python",
  "runnerError.notReady": "O mecanismo Python ainda não está pronto",
  "runnerError.traceLimit": "A visualização excedeu o limite de {steps} passos",
};

const korean: Record<TranslationKey, string> = {
  "meta.description":
    "일반적인 Python으로 작성한 정렬 알고리즘을 한 줄씩 시각화하며 배우는 도구",
  "brand.home": "Code Sortings 홈",
  "locale.label": "표시 언어",
  "engine.preparing": "Python 준비 중",
  "engine.ready": "Python 준비 완료",
  "engine.running": "코드 실행 중",
  "engine.failed": "Python 시작 실패",
  "settings.label": "실행 설정",
  "field.algorithm": "알고리즘",
  "field.pattern": "입력 패턴",
  "field.length": "요소 수",
  "pattern.random": "무작위",
  "pattern.nearlySorted": "거의 정렬됨",
  "pattern.reversed": "역순",
  "pattern.fewUnique": "중복 값 많음",
  "patternHint.random":
    "순서 편향이 없어 일반적인 동작을 관찰하기 좋은 입력입니다.",
  "patternHint.nearlySorted":
    "이미 목적지 가까이에 있는 값을 어떻게 처리하는지 보여 줍니다. Insertion Sort가 잘하는 입력입니다.",
  "patternHint.reversed":
    "여러 단순한 방법에서 교환이 늘어납니다. 최악의 경우를 살펴보기 좋습니다.",
  "patternHint.fewUnique":
    "같은 값을 처리하는 방법을 보여 주며 비교 조건과 안정성을 생각하게 합니다.",
  "action.run": "실행",
  "editor.label": "Python 정렬 코드",
  "source.waiting": "실행 대기",
  "source.before": "실행 전",
  "source.line": "{function}() · {line}번째 줄",
  "metrics.label": "실행 지표",
  "metrics.comparisons": "비교",
  "metrics.frames": "프레임",
  "timeline.label": "타임라인",
  "transport.label": "재생 컨트롤",
  "transport.first": "처음",
  "transport.firstTitle": "첫 프레임으로",
  "transport.back": "이전",
  "transport.backTitle": "한 프레임 뒤로",
  "transport.play": "재생",
  "transport.playTitle": "재생 (Space)",
  "transport.pause": "일시 정지",
  "transport.pauseTitle": "일시 정지 (Space)",
  "transport.stop": "정지",
  "transport.forward": "다음",
  "transport.forwardTitle": "한 프레임 앞으로",
  "speed.label": "속도",
  "speed.slow": "느리게",
  "speed.normal": "보통",
  "speed.fast": "빠르게",
  "status.enginePreparing": "Python 엔진을 준비하고 있습니다…",
  "status.executing": "Python 코드를 실행하고 있습니다…",
  "status.valuesChanged":
    "실행은 완료되었지만 원래 배열의 값 구성이 달라졌습니다",
  "status.notSorted":
    "실행은 완료되었지만 배열이 오름차순이 아닙니다 (Python {version})",
  "status.sampled": " · {steps}개 작업에서 샘플링",
  "status.complete": "완료 · {frames}프레임{sampling} · Python {version}",
  "error.loadExample": "예제 코드를 불러올 수 없습니다",
  "error.visualizationTitle": "코드를 실행할 수 없습니다",
  "error.visualizationDetail":
    "오류를 확인하고 코드를 수정한 뒤 다시 시도하세요.",
  "lesson.algorithm": "알고리즘",
  "lesson.complexity": "복잡도",
  "lesson.best": "최선",
  "lesson.average": "평균",
  "lesson.worst": "최악",
  "lesson.trait": "특징",
  "lesson.focus": "관찰할 점",
  "operation.mark.kind": "위치 확정",
  "operation.mark.title": "{indices}{suffix} 위치를 정렬 완료로 표시했습니다",
  "operation.mark.more": " 외 {count}개",
  "operation.swap.kind": "값 교환",
  "operation.swap.title": "array[{left}]와 array[{right}]를 교환했습니다",
  "operation.write.kind": "값 쓰기",
  "operation.write.one": "array[{index}]를 업데이트했습니다",
  "operation.write.many": "{count}개 위치를 업데이트했습니다",
  "operation.compare.kind": "값 비교",
  "operation.compare.title":
    "array[{left}]와 array[{right}]를 “{operator}”로 비교했습니다",
  "operation.compare.fallback": "비교",
  "operation.read.kind": "값 읽기",
  "operation.read.title": "array[{index}]에서 {value}을(를) 읽었습니다",
  "operation.advance.kind": "코드 진행",
  "operation.advance.title": "{function}()의 {line}번째 줄을 실행했습니다",
  "operation.advance.noChange": "이 줄에서는 배열의 값이 바뀌지 않습니다",
  "operation.start.kind": "시작 위치",
  "operation.start.title": "실행 전 배열입니다",
  "operation.start.detail":
    "재생을 누르거나 타임라인을 움직여 변화를 따라가 보세요.",
  "operation.boot.detail":
    "Python 준비가 끝나면 첫 번째 예제가 자동으로 실행됩니다.",
  "chart.label": "정렬 배열. 비교 {comparisons}회, 현재 {frame}번째 프레임",
  "chart.title": "배열: {values}",
  "runner.cancelled": "새 실행을 시작했습니다",
  "runner.stopped": "실행을 중지했습니다",
  "runner.timeout": "실행이 {seconds}초를 초과하여 중지했습니다",
  "runner.bootTimeout": "Python 엔진 시작 시간이 초과되었습니다",
  "runnerError.finite": "배열에는 유한한 숫자만 대입할 수 있습니다",
  "runnerError.fixedLength": "정렬 중에는 배열 길이를 바꿀 수 없습니다",
  "runnerError.inputLength": "배열 길이는 3에서 300 사이여야 합니다",
  "runnerError.defineSort": "먼저 def sort(array): 를 정의하세요",
  "runnerError.load": "Python 실행기를 불러올 수 없습니다",
  "runnerError.notReady": "Python 엔진이 아직 준비되지 않았습니다",
  "runnerError.traceLimit": "시각화가 {steps}단계 제한을 초과했습니다",
};

const french: Record<TranslationKey, string> = {
  "meta.description":
    "Visualisez et apprenez, ligne par ligne, des algorithmes de tri écrits en Python ordinaire",
  "brand.home": "Accueil de Code Sortings",
  "locale.label": "Langue de l’interface",
  "engine.preparing": "Préparation de Python",
  "engine.ready": "Python prêt",
  "engine.running": "Exécution du code",
  "engine.failed": "Échec du démarrage de Python",
  "settings.label": "Paramètres d’exécution",
  "field.algorithm": "Algorithme",
  "field.pattern": "Type d’entrée",
  "field.length": "Éléments",
  "pattern.random": "Aléatoire",
  "pattern.nearlySorted": "Presque trié",
  "pattern.reversed": "Inversé",
  "pattern.fewUnique": "Peu de valeurs",
  "patternHint.random":
    "Une entrée sans biais d’ordre, utile pour observer le comportement habituel.",
  "patternHint.nearlySorted":
    "Montre comment sont traitées les valeurs déjà proches de leur destination. Insertion Sort excelle ici.",
  "patternHint.reversed":
    "De nombreuses méthodes simples effectuent plus d’échanges. Utilisez-la pour explorer le pire cas.",
  "patternHint.fewUnique":
    "Montre le traitement des valeurs égales et invite à réfléchir aux comparaisons et à la stabilité.",
  "action.run": "Exécuter",
  "editor.label": "Code Python de tri",
  "source.waiting": "En attente",
  "source.before": "Avant l’exécution",
  "source.line": "{function}() · ligne {line}",
  "metrics.label": "Mesures d’exécution",
  "metrics.comparisons": "Comparaisons",
  "metrics.frames": "Image",
  "timeline.label": "Chronologie",
  "transport.label": "Commandes de lecture",
  "transport.first": "Début",
  "transport.firstTitle": "Aller à la première image",
  "transport.back": "Retour",
  "transport.backTitle": "Reculer d’une image",
  "transport.play": "Lire",
  "transport.playTitle": "Lire (Space)",
  "transport.pause": "Pause",
  "transport.pauseTitle": "Pause (Space)",
  "transport.stop": "Arrêter",
  "transport.forward": "Suivant",
  "transport.forwardTitle": "Avancer d’une image",
  "speed.label": "Vitesse",
  "speed.slow": "Lente",
  "speed.normal": "Normale",
  "speed.fast": "Rapide",
  "status.enginePreparing": "Préparation du moteur Python…",
  "status.executing": "Exécution du code Python…",
  "status.valuesChanged":
    "L’exécution est terminée, mais les valeurs du tableau d’origine ont changé",
  "status.notSorted":
    "L’exécution est terminée, mais le tableau n’est pas en ordre croissant (Python {version})",
  "status.sampled": " · échantillon de {steps} opérations",
  "status.complete": "Terminé · {frames} images{sampling} · Python {version}",
  "error.loadExample": "Impossible de charger le code d’exemple",
  "error.visualizationTitle": "Impossible d’exécuter le code",
  "error.visualizationDetail":
    "Consultez l’erreur, modifiez le code puis réessayez.",
  "lesson.algorithm": "Algorithme",
  "lesson.complexity": "Complexité",
  "lesson.best": "Meilleur",
  "lesson.average": "Moyen",
  "lesson.worst": "Pire",
  "lesson.trait": "Caractéristiques",
  "lesson.focus": "À observer",
  "operation.mark.kind": "Position fixée",
  "operation.mark.title": "Positions triées : {indices}{suffix}",
  "operation.mark.more": " et {count} autres",
  "operation.swap.kind": "Échanger les valeurs",
  "operation.swap.title": "array[{left}] et array[{right}] ont été échangés",
  "operation.write.kind": "Écrire une valeur",
  "operation.write.one": "array[{index}] a été mis à jour",
  "operation.write.many": "{count} positions ont été mises à jour",
  "operation.compare.kind": "Comparer les valeurs",
  "operation.compare.title":
    "array[{left}] et array[{right}] comparés avec « {operator} »",
  "operation.compare.fallback": "comparer",
  "operation.read.kind": "Lire une valeur",
  "operation.read.title": "Valeur {value} lue dans array[{index}]",
  "operation.advance.kind": "Avancer dans le code",
  "operation.advance.title": "Ligne {line} de {function}() exécutée",
  "operation.advance.noChange":
    "Cette ligne ne modifie aucune valeur du tableau",
  "operation.start.kind": "Point de départ",
  "operation.start.title": "Voici le tableau avant l’exécution",
  "operation.start.detail":
    "Lancez la lecture ou déplacez la chronologie pour suivre chaque changement.",
  "operation.boot.detail":
    "Le premier exemple s’exécutera automatiquement lorsque Python sera prêt.",
  "chart.label":
    "Tableau en cours de tri. {comparisons} comparaisons, image {frame}",
  "chart.title": "Tableau : {values}",
  "runner.cancelled": "Une nouvelle exécution a commencé",
  "runner.stopped": "Exécution arrêtée",
  "runner.timeout": "L’exécution a dépassé {seconds} secondes et a été arrêtée",
  "runner.bootTimeout": "Le moteur Python a dépassé le délai de démarrage",
  "runnerError.finite":
    "Seuls des nombres finis peuvent être affectés au tableau",
  "runnerError.fixedLength":
    "La longueur du tableau ne peut pas changer pendant le tri",
  "runnerError.inputLength":
    "La longueur du tableau doit être comprise entre 3 et 300",
  "runnerError.defineSort": "Définissez d’abord def sort(array):",
  "runnerError.load": "Impossible de charger l’exécuteur Python",
  "runnerError.notReady": "Le moteur Python n’est pas encore prêt",
  "runnerError.traceLimit":
    "La visualisation a dépassé la limite de {steps} étapes",
};

const german: Record<TranslationKey, string> = {
  "meta.description":
    "Sortieralgorithmen in normalem Python Zeile für Zeile visualisieren und lernen",
  "brand.home": "Code Sortings Startseite",
  "locale.label": "Anzeigesprache",
  "engine.preparing": "Python wird vorbereitet",
  "engine.ready": "Python bereit",
  "engine.running": "Code wird ausgeführt",
  "engine.failed": "Python konnte nicht gestartet werden",
  "settings.label": "Ausführungseinstellungen",
  "field.algorithm": "Algorithmus",
  "field.pattern": "Eingabemuster",
  "field.length": "Elemente",
  "pattern.random": "Zufällig",
  "pattern.nearlySorted": "Fast sortiert",
  "pattern.reversed": "Umgekehrt",
  "pattern.fewUnique": "Wenige Werte",
  "patternHint.random":
    "Eine Eingabe ohne Reihenfolgetendenz, gut geeignet für typisches Verhalten.",
  "patternHint.nearlySorted":
    "Zeigt den Umgang mit Werten, die schon nahe am Ziel liegen. Insertion Sort ist hier besonders stark.",
  "patternHint.reversed":
    "Viele einfache Verfahren tauschen hier häufiger. Gut geeignet, um den ungünstigsten Fall zu untersuchen.",
  "patternHint.fewUnique":
    "Zeigt den Umgang mit gleichen Werten und regt zum Nachdenken über Vergleiche und Stabilität an.",
  "action.run": "Ausführen",
  "editor.label": "Python-Sortiercode",
  "source.waiting": "Wartet auf Ausführung",
  "source.before": "Vor der Ausführung",
  "source.line": "{function}() · Zeile {line}",
  "metrics.label": "Ausführungswerte",
  "metrics.comparisons": "Vergleiche",
  "metrics.frames": "Frame",
  "timeline.label": "Zeitleiste",
  "transport.label": "Wiedergabesteuerung",
  "transport.first": "Anfang",
  "transport.firstTitle": "Zum ersten Frame",
  "transport.back": "Zurück",
  "transport.backTitle": "Einen Frame zurück",
  "transport.play": "Abspielen",
  "transport.playTitle": "Abspielen (Space)",
  "transport.pause": "Pause",
  "transport.pauseTitle": "Pause (Space)",
  "transport.stop": "Stoppen",
  "transport.forward": "Weiter",
  "transport.forwardTitle": "Einen Frame weiter",
  "speed.label": "Tempo",
  "speed.slow": "Langsam",
  "speed.normal": "Normal",
  "speed.fast": "Schnell",
  "status.enginePreparing": "Python-Engine wird vorbereitet…",
  "status.executing": "Python-Code wird ausgeführt…",
  "status.valuesChanged":
    "Die Ausführung ist beendet, aber die Werte des ursprünglichen Arrays wurden verändert",
  "status.notSorted":
    "Die Ausführung ist beendet, aber das Array ist nicht aufsteigend sortiert (Python {version})",
  "status.sampled": " · Stichprobe aus {steps} Operationen",
  "status.complete": "Fertig · {frames} Frames{sampling} · Python {version}",
  "error.loadExample": "Der Beispielcode konnte nicht geladen werden",
  "error.visualizationTitle": "Der Code konnte nicht ausgeführt werden",
  "error.visualizationDetail":
    "Fehler prüfen, Code bearbeiten und erneut versuchen.",
  "lesson.algorithm": "Algorithmus",
  "lesson.complexity": "Komplexität",
  "lesson.best": "Bester",
  "lesson.average": "Durchschnitt",
  "lesson.worst": "Schlechtester",
  "lesson.trait": "Eigenschaften",
  "lesson.focus": "Darauf achten",
  "operation.mark.kind": "Position festgelegt",
  "operation.mark.title": "{indices}{suffix} als sortiert markiert",
  "operation.mark.more": " und {count} weitere",
  "operation.swap.kind": "Werte tauschen",
  "operation.swap.title": "array[{left}] und array[{right}] wurden getauscht",
  "operation.write.kind": "Wert schreiben",
  "operation.write.one": "array[{index}] wurde aktualisiert",
  "operation.write.many": "{count} Positionen wurden aktualisiert",
  "operation.compare.kind": "Werte vergleichen",
  "operation.compare.title":
    "array[{left}] und array[{right}] mit „{operator}“ verglichen",
  "operation.compare.fallback": "vergleichen",
  "operation.read.kind": "Wert lesen",
  "operation.read.title": "{value} aus array[{index}] gelesen",
  "operation.advance.kind": "Code fortsetzen",
  "operation.advance.title": "Zeile {line} von {function}() ausgeführt",
  "operation.advance.noChange": "Diese Zeile verändert keine Werte im Array",
  "operation.start.kind": "Startpunkt",
  "operation.start.title": "Dies ist das Array vor der Ausführung",
  "operation.start.detail":
    "Abspielen drücken oder die Zeitleiste bewegen, um jede Änderung zu verfolgen.",
  "operation.boot.detail":
    "Das erste Beispiel wird automatisch ausgeführt, sobald Python bereit ist.",
  "chart.label": "Sortierendes Array. {comparisons} Vergleiche, Frame {frame}",
  "chart.title": "Array: {values}",
  "runner.cancelled": "Eine neue Ausführung wurde gestartet",
  "runner.stopped": "Ausführung gestoppt",
  "runner.timeout":
    "Die Ausführung überschritt {seconds} Sekunden und wurde gestoppt",
  "runner.bootTimeout": "Zeitüberschreitung beim Start der Python-Engine",
  "runnerError.finite":
    "Dem Array dürfen nur endliche Zahlen zugewiesen werden",
  "runnerError.fixedLength":
    "Die Array-Länge darf beim Sortieren nicht verändert werden",
  "runnerError.inputLength": "Die Array-Länge muss zwischen 3 und 300 liegen",
  "runnerError.defineSort": "Zuerst def sort(array): definieren",
  "runnerError.load": "Der Python-Runner konnte nicht geladen werden",
  "runnerError.notReady": "Die Python-Engine ist noch nicht bereit",
  "runnerError.traceLimit":
    "Die Visualisierung hat das Limit von {steps} Schritten überschritten",
};

const dictionaries: Record<Locale, Record<TranslationKey, string>> = {
  ja: japanese,
  en: english,
  "zh-CN": chineseSimplified,
  es: spanish,
  "pt-BR": portugueseBrazil,
  ko: korean,
  fr: french,
  de: german,
};

let currentLocale: Locale = "ja";

export const getLocale = (): Locale => currentLocale;

export const normalizeLocale = (
  candidate: string | null | undefined,
): Locale | null => {
  if (!candidate) return null;
  const normalized = candidate.trim().toLowerCase();
  const exact = SUPPORTED_LOCALES.find(
    ({ code }) => code.toLowerCase() === normalized,
  );
  if (exact) return exact.code;
  if (normalized.startsWith("zh")) return "zh-CN";
  if (normalized.startsWith("pt")) return "pt-BR";
  const language = normalized.split("-")[0];
  const match = SUPPORTED_LOCALES.find(({ code }) => code === language);
  return match?.code ?? null;
};

export const isLocale = (candidate: string): candidate is Locale =>
  normalizeLocale(candidate) === candidate;

export const resolveInitialLocale = (): Locale => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "ja";
  }
  try {
    const savedLocale = window.localStorage.getItem("code-sortings-locale");
    const normalizedSavedLocale = normalizeLocale(savedLocale);
    if (normalizedSavedLocale) return normalizedSavedLocale;
  } catch {
    // The app still works when storage is unavailable.
  }
  const browserLocales = navigator.languages.length
    ? navigator.languages
    : [navigator.language];
  for (const browserLocale of browserLocales) {
    const normalizedBrowserLocale = normalizeLocale(browserLocale);
    if (normalizedBrowserLocale) return normalizedBrowserLocale;
  }
  return "en";
};

export const setLocale = (locale: Locale, persist = true): void => {
  currentLocale = locale;
  if (typeof document !== "undefined") {
    document.documentElement.lang = locale;
  }
  if (!persist || typeof window === "undefined") return;
  try {
    window.localStorage.setItem("code-sortings-locale", locale);
  } catch {
    // The selected locale remains active for the current page.
  }
};

export const t = (
  key: TranslationKey,
  parameters: Record<string, string | number> = {},
): string =>
  dictionaries[currentLocale][key].replace(
    /\{(\w+)\}/g,
    (placeholder, name: string) =>
      Object.hasOwn(parameters, name) ? String(parameters[name]) : placeholder,
  );

export const formatNumber = (value: number): string =>
  value.toLocaleString(currentLocale);

export const translateDocument = (root: ParentNode = document): void => {
  root.querySelectorAll<HTMLElement>("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n as TranslationKey;
    element.textContent = t(key);
  });
  root.querySelectorAll<HTMLElement>("[data-i18n-title]").forEach((element) => {
    const key = element.dataset.i18nTitle as TranslationKey;
    element.title = t(key);
  });
  root
    .querySelectorAll<HTMLElement>("[data-i18n-aria-label]")
    .forEach((element) => {
      const key = element.dataset.i18nAriaLabel as TranslationKey;
      element.setAttribute("aria-label", t(key));
    });
  const description = document.querySelector<HTMLMetaElement>(
    'meta[name="description"]',
  );
  if (description) description.content = t("meta.description");
};

export const localizeRunnerError = (message: string): string => {
  const exactMessages: Record<string, TranslationKey> = {
    配列には有限の数値だけを代入できます: "runnerError.finite",
    ソート中に配列の長さを変更することはできません: "runnerError.fixedLength",
    "配列の長さは3〜300にしてください": "runnerError.inputLength",
    "def sort(array): を定義してください": "runnerError.defineSort",
    Pythonランナーを読み込めませんでした: "runnerError.load",
    Pythonエンジンの準備が完了していません: "runnerError.notReady",
  };
  const exactMessageKey = exactMessages[message];
  if (exactMessageKey) return t(exactMessageKey);

  const traceLimit = message.match(
    /^可視化ステップ数が上限の ([\d,]+) を超えました$/,
  );
  if (traceLimit) {
    return t("runnerError.traceLimit", { steps: traceLimit[1] });
  }
  return message;
};
