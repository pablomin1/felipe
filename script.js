document.addEventListener("DOMContentLoaded", () => {
    // Obtener elementos del DOM
    const input = document.getElementById("input-cadena");
    const resultBox = document.getElementById("resultado");
    const arbolSintacticoContainer = document.getElementById("arbolSintacticoContainer");

    // Botones
    const analizarBtn = document.getElementById("analizarBtn");
    const borrarBtn = document.getElementById("borrarBtn");
    const analizarSintacticoBtn = document.getElementById("analizarSintacticoBtn");
    const equipoBtn = document.getElementById("equipoBtn");
    const salirBtn = document.getElementById("salirBtn");

    // Diccionario de Palabras reservadas
    const palabrasReservadas = {
        "EQUIPO": "palabra reservada",
        "MIENTRAS": "palabra reservada",
        "FUNCION": "palabra reservada",
        "MOSTRAR": "palabra reservada",
        "CONVERTIRENTERO": "palabra reservada",
        "ALEATORIONUMERO": "palabra reservada",
        "DECLARAR": "palabra reservada",
        "ENTERO": "tipo de dato ",
        "FLOTANTE": "tipo de dato",
        "CADENA": "tipo de dato",
        "CONENTERO": "tipo de dato",
        "CONFLOTANTE": "tipo de dato",
        "CONCADENA": "tipo de dato",
        "BOOLEANO": "tipo de dato",
        "FECHAACTUAL": "palabra reservada",
        "EXISTE": "palabra reservada",
        "TAMAÑOCADENA": "palabra reservada",
        "PAUSARYREANUDARGENERADOR": "palabra reservada",
        "AUTOEJECUTAR": "palabra reservada",
        "CAPTURAR": "palabra reservada",
        "COMPARAR": "palabra reservada",
        "SINO": "palabra reservada",
        "ORDENAR": "Palabra reservada",
        "PARA": "palabra reservada",
        "DIVIDIRCADENA": "palabra reservada",
        "SELECCIONAR": "palabra reservada",
        "CASO": "palabra reservada",
        "TERMINAR": "palabra reservada",
        "PORDEFECTO": "palabra reservada",
        "DEFINIRCLASE": "palabra reservada",
        "INICIAR": "palabra reservada",
        "ESTE": "palabra reservada",
        "OBTENERCARACTER": "palabra reservada",
    };

    // Diccionario de Declaración de Símbolos del Analizador
    const simbolos = {
        "=": "símbolo de asignación",
        "+": "símbolo de suma",
        "-": "símbolo de resta",
        "*": "símbolo de multiplicación",
        "/": "símbolo de división",
        "^": "símbolo de potencia",
        "%": "símbolo de módulo",
        "(": "paréntesis izquierdo",
        ")": "paréntesis derecho",
        ";": "símbolo de fin de instrucción",
        "{": "llave izquierda",
        "}": "llave derecha",
        ",": "coma",
        "!=": "diferente de",
        "==": "igual a",
        ">": "mayor que",
        "<": "menor que",
        ">=": "mayor o igual que",
        "<=": "menor o igual que",
        "!": "negación",
        "&&": "y lógico",
        "||": "o lógico",
        "++": "incremento",
        "--": "decremento",
        "[": "corchete apertura izquierda",
        "]": "corchete cierre derecha "
    };

    let idCounter = 1;
    let idMap = {};

    function validarInstruccionCompleta(codigo) {
        const instrucciones = [
            { nombre: "EQUIPO", forma: /^EQUIPO\(\);$/i },
            { nombre: "MIENTRAS", forma: /^MIENTRAS\s*\(\s*(?:[a-zA-Z][a-zA-Z0-9]*|\d+)\s*(==|!=|>=|<=|<|>)\s*(?:[a-zA-Z][a-zA-Z0-9]*|\d+)\s*\)\s*\{[\s\S]*\}\s*$/i },
            { nombre: "FUNCION", forma: /^FUNCION\s+[a-zA-Z][a-zA-Z0-9]*\s*\(\s*[^(){};]*\s*\)\s*\{[\s\S]*\}\s*$/i },
            { nombre: "MOSTRAR", forma: /^mostrar\s*\(\s*(("[^"]*(\\n|\\t|\\\\)?[^"]*"|[a-zA-Z_][a-zA-Z0-9_]*)(\s*\|\s*("[^"]*"|[a-zA-Z_][a-zA-Z0-9_]*))?)\s*\)\s*;$/i },
            { nombre: "CONVERTIRENTERO", forma: /^convertirEntero\s*\(\s*("[^"]*"|[a-zA-Z_][a-zA-Z0-9_]*)\s*\)\s*;$/i },
            { nombre: "ALEATORIONUMERO", forma: /^aleatorioNumero\s*\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)\s*;$/i },
            { nombre: "DECLARAR", forma: /^declarar\s+(entero|flotante|cadena|conEntero|conFlotante|conCadena|booleano)\s+[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*(("[^"]*")|(\d+(\.\d+)?)|verdadero|falso)\s*;$/i },
            { nombre: "FECHAACTUAL", forma: /^fechaActual\s*\(\s*(dia|mes|año|hora|minuto|segundo)\s*\)\s*;$/i },
            { nombre: "EXISTE", forma: /^existe\s*\(\s*\[([0-9]+(?:\s*,\s*[0-9]+)*)\]\s*,\s*[0-9]+\s*\)\s*;$/i },
            { nombre: "TAMAÑOCADENA", forma: /^tamañoCadena\s*\(\s*"[^"]+"\s*\)\s*;$/i },
            { nombre: "PAUSARYREANUDARGENERADOR", forma: /^PausaryReanudarGenerador\s*\(\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\)\s*;$/i },
            { nombre: "AUTOEJECUTAR", forma: /^autoejecutar\s*\(\s*[a-zA-Z_][a-zA-Z0-9_]*\s*,\s*\d+\s*\)\s*;$/i },
            { nombre: "CAPTURAR", forma: /^capturar\s*\(\s*"[^"]*"\s*\)\s*;$/i },
            { nombre: "COMPARAR", forma: /^COMPARAR\s*\(\s*(?:[a-zA-Z_][a-zA-Z0-9_]*|\d+)\s*(==|!=|>=|<=|<|>)\s*(?:[a-zA-Z_][a-zA-Z0-9_]*|\d+)\s*\)\s*\{\s*[\s\S]*\s*\}(\s*SINO\s*\{\s*[\s\S]*\s*\})?\s*$/i },
            { nombre: "ORDENAR", forma: /^ordenar\s*\(\s*\[.*\]\s*\)\s*;$/i },
            { nombre: "PARA", forma: /^para\s*\(\s*var\s+[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*(\d+|[a-zA-Z_][a-zA-Z0-9_]*)\s*;\s*[a-zA-Z_][a-zA-Z0-9_]*\s*(==|!=|>=|<=|<|>)\s*(\d+|[a-zA-Z_][a-zA-Z0-9_]*)\s*;\s*[a-zA-Z_][a-zA-Z0-9_]*\s*(\+\+|--)\s*\)\s*\{\s*[\s\S]*\s*\}$/i },
            { nombre: "DIVIDIRCADENA", forma: /^dividirCadena\s*\(\s*("[^"]*"|[a-zA-Z_][a-zA-Z0-9_]*)\s*,\s*("[^"]*"|[a-zA-Z_][a-zA-Z0-9_]*)\s*\)\s*;$/i },
            { nombre: "SELECCIONAR", forma: /^SELECCIONAR\s*\(\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\)\s*\{\s*(CASO\s+("[^"]*"|[a-zA-Z_][a-zA-Z0-9_]*|\d+|true|false|verdadero|falso)\s*:\s*[^;]*;\s*TERMINAR;\s*)*(PORDEFECTO\s*:\s*[^;]*;\s*TERMINAR;\s*)?\}$/i },
            { nombre: "DEFINIRCLASE", forma: /^DEFINIRCLASE\s+[A-Z][a-zA-Z0-9_]*\s*\{\s*INICIAR\s*\(([^)]*)\)\s*\{\s*(ESTE\.[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*[a-zA-Z_][a-zA-Z0-9_]*\s*;?\s*)*\s*\}\s*(\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\(([^)]*)\)\s*\{[^}]*\}\s*)*\s*\}\s*$/ },
            { nombre: "OBTENERCARACTER", forma: /^obtenerCaracter\s*\(\s*("[^"]*"|[a-zA-Z_][a-zA-Z0-9_]*)\s*,\s*([0-9]+|[a-zA-Z_][a-zA-Z0-9_]*)\s*\)\s*;$/i },
        ];

        const codigoSinEspacios = codigo.trim();
        for (const instr of instrucciones) {
            if (codigoSinEspacios.toUpperCase().startsWith(instr.nombre)) {
                if (!instr.forma.test(codigoSinEspacios)) {
                    return `Error: instrucción ${instr.nombre} mal formada. La forma correcta es: ${instr.nombre} ...`;
                }
                return null;
            }
        }

        const asignacionRegex = /^([a-zA-Z_][a-zA-Z0-9_]*(\[[^\]]*\])?(\.[a-zA-Z_][a-zA-Z0-9_]*)?)\s*=\s*([^;]+);$/;
        const match = codigoSinEspacios.match(asignacionRegex);
        if (match) {
            const identificador = match[1];
            if (palabrasReservadas[identificador.toUpperCase()] || !isNaN(identificador)) {
                return `Error: '${identificador}' no puede ser asignado.`;
            }
            return null; // Asignación válida
        }
        
        if (/[a-zA-Z0-9"'\(\)\+\-\*\/\.%^]+/.test(codigoSinEspacios)) {
             return null;
        }

        return "Error: instrucción no reconocida o mal formada.";
    }

    function analizarCadena(cadena) {
        idCounter = 1;
        idMap = {};
        const codigo = cadena.trim();
        const errorInstruccion = validarInstruccionCompleta(codigo);
        if (errorInstruccion) return errorInstruccion;

        const tokens = codigo.match(/!=|==|>=|<=|\|\||&&|\+\+|--|<<|>>|\^|%|\w+[\wñÑ]*|\[|\]|\(|\)|[=+\-*/{};,<>!]|"[^"]*"/g);
        if (!tokens) return "No se encontró ninguna cadena válida.";

        const instruccion = tokens[0]?.toUpperCase();
        if ((instruccion === "MOSTRAR" || instruccion === "CONVERTIRENTERO") &&
            tokens[1] === "(" && tokens[2] === '""' && tokens[3] === ")" && tokens[4] === ";") {
            return `Error: instrucción ${instuccion} mal formada. La forma correcta es: ${instuccion}("texto");`;
        }
        
        return tokens.map(token => {
            if (!isNaN(token)) {
                return `${token} es número`;
            } else if (palabrasReservadas[token.toUpperCase()]) {
                return `${token} ${palabrasReservadas[token.toUpperCase()]}`;
            } else if (simbolos[token]) {
                return `${token} ${simbolos[token]}`;
            } else if (token.startsWith('"') && token.endsWith('"')) {
                const contenidoTexto = token.slice(1, -1);
                return `" comilla que abre\n${contenidoTexto} texto\n" comilla que cierra`;
            } else if (token.toUpperCase() in palabrasReservadas) {
                return `Error: '${token}' es una palabra reservada y no puede ser usada como identificador.`;
            } else if (/^[a-zA-Z]\w*$/.test(token)) {
                if (!idMap[token]) {
                    idMap[token] = `id${idCounter++}`;
                }
                return `${token} es ${idMap[token]}`;
            } else {
                return `${token} no reconocido`;
            }
        }).join('\n');
    }

    function extraerExpresion(cadena) {
        const match = cadena.match(/=\s*([^;]+);/);
        if (match && match[1]) {
            return match[1].trim();
        }
        return cadena.trim();
    }

    analizarBtn.addEventListener("click", () => {
        const cadena = input.value.trim();
        if (cadena === "") {
            resultBox.value = "Por favor ingresa una cadena.";
            return;
        }
        const resultado = analizarCadena(cadena);
        resultBox.value = resultado;
    });

    borrarBtn.addEventListener("click", () => {
        input.value = "";
        resultBox.value = "";
        arbolSintacticoContainer.innerHTML = "";
    });

    analizarSintacticoBtn.addEventListener("click", () => {
        const cadena = input.value.trim();
        if (cadena === "") {
            resultBox.value = "Por favor ingresa una cadena para analizar.";
            return;
        }
        
        try {
            const expresion = extraerExpresion(cadena);
            if (!expresion) {
                resultBox.value = "Error: La expresión a analizar está vacía.";
                return;
            }
            
            // Primero, genera el resultado del análisis léxico para que idMap se llene
            analizarCadena(cadena);
            const ast = generarAST(expresion);
            abrirVentanaArbolSintactico(ast, cadena, idMap);
            resultBox.value = "Análisis sintáctico exitoso. Árbol generado en una nueva ventana.";
        } catch (e) {
            resultBox.value = "Error en el análisis sintáctico: " + e.message;
        }
    });

    // Función para generar un Abstract Syntax Tree (AST)
    function generarAST(expresion) {
        const tokens = expresion.match(/([a-zA-Z_]\w*|\d+|[+\-*/%^()])/g);
        if (!tokens || tokens.length === 0) {
            throw new Error("Expresión inválida.");
        }

        const precedencia = {
            '+': 1,
            '-': 1,
            '%': 2,
            '*': 2,
            '/': 2,
            '^': 3
        };

        const salida = [];
        const operadores = [];

        tokens.forEach(token => {
            if (!isNaN(token)) {
                salida.push({ tipo: 'numero', valor: token });
            } else if (/[a-zA-Z_]\w*$/.test(token)) {
                salida.push({ tipo: 'variable', valor: idMap[token] || token });
            } else if (token === '(') {
                operadores.push(token);
            } else if (token === ')') {
                let ultimoOperador = operadores.pop();
                while (ultimoOperador !== '(') {
                    salida.push({ tipo: 'operador', valor: ultimoOperador });
                    if (operadores.length === 0) throw new Error("Paréntesis desequilibrados.");
                    ultimoOperador = operadores.pop();
                }
            } else if (['+', '-', '*', '/', '^', '%'].includes(token)) {
                let ultimoOperador = operadores[operadores.length - 1];
                while (
                    operadores.length > 0 &&
                    ultimoOperador !== '(' &&
                    precedencia[ultimoOperador] >= precedencia[token] &&
                    !(precedencia[token] === 4 && precedencia[ultimoOperador] === 4) // Right-associativity for **
                ) {
                    salida.push({ tipo: 'operador', valor: operadores.pop() });
                    ultimoOperador = operadores[operadores.length - 1];
                }
                operadores.push(token);
            } else {
                throw new Error(`Token no reconocido en la expresión: ${token}`);
            }
        });

        while (operadores.length > 0) {
            const op = operadores.pop();
            if (op === '(' || op === ')') {
                throw new Error("Paréntesis desequilibrados.");
            }
            salida.push({ tipo: 'operador', valor: op });
        }

        const stack = [];
        salida.forEach(token => {
            if (token.tipo === 'numero' || token.tipo === 'variable') {
                stack.push({ valor: token.valor, hijos: [], tipo: token.tipo });
            } else if (token.tipo === 'operador') {
                const derecha = stack.pop();
                const izquierda = stack.pop();
                if (izquierda && derecha) {
                    stack.push({
                        valor: token.valor,
                        hijos: [izquierda, derecha],
                        tipo: token.tipo
                    });
                } else {
                    throw new Error("Expresión mal formada.");
                }
            }
        });

        if (stack.length !== 1) {
            throw new Error("Expresión inválida.");
        }

        return stack[0];
    }
    
    function abrirVentanaArbolSintactico(ast, cadenaCompleta, idMap) {
        const ventana = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
        
        const style = `
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f5f5f5;
                color: #333;
                margin: 0;
                padding: 0;
            }
            #arbolSintacticoContainer {
                display: flex;
                justify-content: center;
                align-items: flex-start;
                padding: 20px;
                margin-top: 20px;
                position: relative;
                min-height: 400px;
                overflow: auto;
                width: 100%;
                height: 100%;
            }
            .node {
                display: inline-block;
                padding: 10px 20px;
                border-radius: 20px;
                border: 2px solid #2F4F4F;
                background-color: #DCDCDC;
                font-weight: bold;
                color: #2F4F4F;
                text-align: center;
                position: absolute;
                z-index: 10;
                box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
                min-width: 60px;
            }
            .node.root {
                background-color: #ADD8E6;
            }
            .node.leaf {
                background-color: #90EE90;
            }
            .line {
                position: absolute;
                height: 1px;
                background-color: #2F4F4F;
                transform-origin: 0 0;
                z-index: 5;
            }
        `;

        const html = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8" />
                <title>Árbol Sintáctico</title>
                <style>${style}</style>
            </head>
            <body>
                <div id="arbolSintacticoContainer"></div>
                <script>
                    const arbolSintacticoContainer = document.getElementById("arbolSintacticoContainer");
                    
                    function measureTextWidth(text) {
                        const span = document.createElement('span');
                        span.style.visibility = 'hidden';
                        span.style.whiteSpace = 'nowrap';
                        span.style.fontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
                        span.style.fontSize = '14px';
                        span.style.fontWeight = 'bold';
                        span.textContent = text;
                        document.body.appendChild(span);
                        const width = span.offsetWidth;
                        document.body.removeChild(span);
                        return width + 40;
                    }

                    function calculateNodePositions(node, x, y, level) {
                        const nodeWidth = measureTextWidth(node.valor);
                        const nodeHeight = 60;
                        const hGap = 60;
                        const vGap = 120;
                        
                        node.x = x;
                        node.y = y;
                        node.width = nodeWidth;
                        node.height = nodeHeight;
                        node.level = level;

                        if (node.hijos && node.hijos.length > 0) {
                            const childrenWidth = node.hijos.reduce((sum, child) => {
                                return sum + calculateSubtreeWidth(child);
                            }, 0) + (node.hijos.length - 1) * hGap;

                            let currentX = x - childrenWidth / 2 + nodeWidth / 2;
                            
                            node.hijos.forEach(child => {
                                const childWidth = calculateSubtreeWidth(child);
                                calculateNodePositions(child, currentX + childWidth / 2, y + vGap, level + 1);
                                currentX += childWidth + hGap;
                            });
                        }
                    }

                    function calculateSubtreeWidth(node) {
                        const nodeWidth = measureTextWidth(node.valor);
                        const hGap = 60;
                        if (!node.hijos || node.hijos.length === 0) {
                            return nodeWidth;
                        }

                        const childrenWidth = node.hijos.reduce((sum, child) => {
                            return sum + calculateSubtreeWidth(child);
                        }, 0) + (node.hijos.length - 1) * hGap;
                        
                        return Math.max(nodeWidth, childrenWidth);
                    }

                    function dibujarArbol(ast) {
                        arbolSintacticoContainer.innerHTML = '';
                        arbolSintacticoContainer.style.position = 'relative';

                        const rootWidth = calculateSubtreeWidth(ast);
                        const rootX = Math.max(arbolSintacticoContainer.offsetWidth / 2, rootWidth / 2 + 50);
                        const rootY = 50;

                        calculateNodePositions(ast, rootX, rootY, 0);

                        function traverseAndDraw(node) {
                            const div = document.createElement('div');
                            div.classList.add('node');
                            
                            // Check the type of the node to format the text
                            if (node.tipo === 'numero') {
                                div.textContent = \`num(\${node.valor})\`;
                                div.classList.add('leaf'); // Numbers are leaves
                            } else if (node.tipo === 'variable') {
                                div.textContent = node.valor;
                                div.classList.add('leaf'); // Variables are leaves
                            } else { // Operator or root
                                div.textContent = node.valor;
                                if (node.valor === '=') {
                                    div.classList.add('root');
                                }
                            }
                            
                            div.style.left = \`\${node.x - node.width / 2}px\`;
                            div.style.top = \`\${node.y}px\`;
                            div.style.width = \`\${node.width}px\`;
                            arbolSintacticoContainer.appendChild(div);

                            if (node.hijos && node.hijos.length > 0) {
                                node.hijos.forEach(child => {
                                    const line = drawLine(node, child);
                                    arbolSintacticoContainer.appendChild(line);
                                    traverseAndDraw(child);
                                });
                            }
                        }
                        
                        traverseAndDraw(ast);
                        
                        const allNodes = arbolSintacticoContainer.querySelectorAll('.node');
                        let maxX = 0;
                        let maxY = 0;
                        allNodes.forEach(node => {
                            const left = parseFloat(node.style.left) + node.offsetWidth;
                            const top = parseFloat(node.style.top) + node.offsetHeight;
                            if (left > maxX) maxX = left;
                            if (top > maxY) maxY = top;
                        });
                        
                        arbolSintacticoContainer.style.width = \`\${maxX + 50}px\`;
                        arbolSintacticoContainer.style.height = \`\${maxY + 50}px\`;
                    }

                    function drawLine(startNode, endNode) {
                        const line = document.createElement('div');
                        line.classList.add('line');
                        
                        const startX = startNode.x;
                        const startY = startNode.y + startNode.height;
                        const endX = endNode.x;
                        const endY = endNode.y;

                        const deltaX = endX - startX;
                        const deltaY = endY - startY;
                        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                        const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

                        line.style.width = \`\${distance}px\`;
                        line.style.left = \`\${startX}px\`; 
                        line.style.top = \`\${startY}px\`;
                        line.style.transform = \`rotate(\${angle}deg)\`;
                        
                        return line;
                    }
                    
                    const astData = ${JSON.stringify(ast)};
                    const idMapData = ${JSON.stringify(idMap)};
                    const isAssignment = "${cadenaCompleta}".includes('=');
                    let finalAST = astData;
                    if (isAssignment) {
                        const identificador = "${cadenaCompleta.split('=')[0].trim()}";
                        finalAST = { valor: '=', hijos: [ { valor: idMapData[identificador] || identificador, hijos: [] }, astData ], tipo: 'operador' };
                    }
                    
                    dibujarArbol(finalAST);

                </script>
            </body>
            </html>
        `;
        ventana.document.open();
        ventana.document.write(html);
        ventana.document.close();
    }

    salirBtn.addEventListener("click", () => {
        Swal.fire({
            title: '¿Estás seguro que quieres salir?',
            //icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.close();
            }
        });
    });

    equipoBtn.addEventListener("click", () => {
        const integrantes = [
            "Amaya Montalvo Pablo Iván",
            "Camacho García Julia Guadalupe",
            "Carreon Rivera Oscar",
            "García Mayorga Brayan Jair",
            "<b>*Luna Alvarado Josué Daniel*</b>",
            "Ramirez Vazquez Wendy Itzel",
            "Vargas Guillén José Ricardo"
        ];

        Swal.fire({
            title: 'Equipo: Dragones 🐉',
            html: integrantes.join('<br>') + '<br><br>Docente: Silva Hernández Felipe',
            //icon: 'success',
            confirmButtonText: 'Cerrar'
        });
    });

    // Función para análisis semántico
    // Analizador semántico completo sin reglas repetidas
function analizarSemanticoCompleto(codigo) {
    const resultado = [];
    const reglas = new Set(); // Para almacenar reglas únicas

    // Función para agregar reglas sin duplicados
    function agregarRegla(regla) {
        if (!reglas.has(regla)) {
            reglas.add(regla);
        }
    }

    // Eliminar saltos de línea innecesarios
    codigo = codigo.replace(/\r\n/g, "\n").trim();

    function analizarBloque(codigoBloque) {
        let index = 0;

        while (index < codigoBloque.length) {
            let resto = codigoBloque.slice(index).trim();

            // ------------------ DECLARAR (VARIABLE O ARREGLO) ------------------
            let declararMatch = resto.match(/^declarar\s+(entero|flotante|cadena|conEntero|conFlotante|conCadena|booleano)\s+([a-zA-Z_]\w*(\[\s*\d+\s*\])?)\s*=\s*([^;]+);/i);
            if (declararMatch) {
                const tipo = declararMatch[1].trim();
                const variable = declararMatch[2].trim();
                const valor = declararMatch[4].trim();

                // ------------------ Detección de arreglo o variable simple ------------------
                const esArreglo = /\[\s*\d+\s*\]/.test(variable);
                const esListaValores = /^\{.*\}$/.test(valor);

                if (esArreglo && esListaValores) {
                    // 📦 Declaración de arreglo
                    resultado.push("instruct -> declarar tipo var[numV] = { expDec ( , expDec )* };");
                    agregarRegla("tipo -> entero || flotante || cadena || conEntero || conFlotante || conCadena || booleano");
                    agregarRegla("expDec -> num || \"let (let||numV)*\" || verdadero || falso");
                    agregarRegla("var -> let (let||numV)*");
                    agregarRegla("numV -> dig dig*");
                    agregarRegla("let -> A-Z || a-z");
                    agregarRegla("num -> (- || ∅ )(dig dig* || dig dig* .dig dig*) ");
                    agregarRegla("dig -> 0-9");
                } else if (esArreglo && !esListaValores) {
                    // 📦 Declaración de arreglo vacío o inicializado con una sola expresión
                    resultado.push("instruct -> declarar tipo var[numV] = expDec;");
                    agregarRegla("tipo -> entero || flotante || cadena || conEntero || conFlotante || conCadena || booleano");
                    agregarRegla("expDec -> num || \"let (let||numV)*\" || verdadero || falso");
                    agregarRegla("var -> let (let||numV)*");
                    agregarRegla("numV -> dig dig*");
                    agregarRegla("let -> A-Z || a-z");
                    agregarRegla("num -> (- || ∅ )(dig dig* || dig dig* .dig dig*) ");
                    agregarRegla("dig -> 0-9");
                } else {
                    // 📦 Declaración simple (variable)
                    resultado.push("instruct -> declarar tipo var = expDec;");
                    agregarRegla("tipo -> entero || flotante || cadena || conEntero || conFlotante || conCadena || booleano");
                    agregarRegla("expDec -> num || \"let (let||numV)*\" || verdadero || falso");
                    agregarRegla("var -> let (let||numV)*");
                    agregarRegla("let -> A-Z || a-z");
                    agregarRegla("num -> (- || ∅ )(dig dig* || dig dig* .dig dig*) ");
                    agregarRegla("dig -> 0-9");
                }

                index += declararMatch[0].length;
                continue;
            }

            // ------------------ MOSTRAR ------------------
            let mostrarMatch = resto.match(/^mostrar\s*\("[^"]*"\);/i);
            if (mostrarMatch) {
                resultado.push('instruct -> mostrar("let (let||numV||b)*") || mostrar(var);');
                agregarRegla("var -> let (let||numV)*");
                agregarRegla("let -> A-Z || a-z");
                agregarRegla("numV -> dig dig*");
                agregarRegla("dig -> 0-9");
                index += mostrarMatch[0].length;
                continue;
            }

            // ------------------ CONVERTIRENTERO ------------------
            let convertirMatch = resto.match(/^convertirEntero\s*\([^\)]+\);/i);
            if (convertirMatch) {
                resultado.push('instruct -> convertirEntero(expConInt);');
                agregarRegla("expConInt -> var || num");
                agregarRegla("var -> let (let||numV)*");
                agregarRegla("let -> A-Z || a-z");
                agregarRegla("numV -> dig dig*");
                agregarRegla("num -> (- || ∅ )(dig dig* || dig dig* .dig dig*) ");
                agregarRegla("dig -> 0-9");
                index += convertirMatch[0].length;
                continue;
            }

            // ------------------ ALEATORIONUMERO ------------------
            let aleatorioMatch = resto.match(/^aleatorioNumero\s*\([^\)]+\);/i);
            if (aleatorioMatch) {
                resultado.push('instruct -> aleatorioNumero((var||num),(var || num);');
                agregarRegla("var -> let (let||numV)*");
                agregarRegla("let -> A-Z || a-z");
                agregarRegla("numV -> dig dig*");
                agregarRegla("num -> (- || ∅ )(dig dig* || dig dig* .dig dig*) ");
                agregarRegla("dig -> 0-9");
                index += aleatorioMatch[0].length;
                continue;
            }

            // ------------------ COMPARAR ------------------
            let compararMatch = resto.match(/^comparar\s*\(([^\)]+)\)\s*\{/i);
            if (compararMatch) {
                resultado.push("instruct -> comparar(expComp oprel expComp){ instruct instruct* }" + (resto.includes("sino{") ? " sino { instruct instruct* }" : ""));
                agregarRegla("expComp -> var || num");
                agregarRegla("oprel -> >= || <= || == || != || > || <");
                agregarRegla("var -> let (let||numV)*");
                agregarRegla("let -> A-Z || a-z");
                agregarRegla("numV -> dig dig*");
                agregarRegla("num -> (- || ∅ )(dig dig* || dig dig* .dig dig*) ");
                agregarRegla("dig -> 0-9");

                // Contenido dentro de {}
                let openBraces = 1;
                let i = compararMatch[0].length;
                while (i < resto.length && openBraces > 0) {
                    if (resto[i] === '{') openBraces++;
                    else if (resto[i] === '}') openBraces--;
                    i++;
                }
                let bloqueInterno = resto.slice(compararMatch[0].length, i - 1);
                analizarBloque(bloqueInterno);

                // Sino
                let sinoMatch = resto.slice(i).match(/^sino\s*\{/i);
                if (sinoMatch) {
                    let startSino = i + sinoMatch[0].length;
                    let openSino = 1;
                    let j = startSino;
                    while (j < resto.length && openSino > 0) {
                        if (resto[j] === '{') openSino++;
                        else if (resto[j] === '}') openSino--;
                        j++;
                    }
                    let bloqueSino = resto.slice(startSino, j - 1);
                    analizarBloque(bloqueSino);
                    i = j;
                }

                index += i;
                continue;
            }

            // ------------------ MIENTRAS ------------------
            let mientrasMatch = resto.match(/^mientras\s*\([^\)]+\)\s*\{/i);
            if (mientrasMatch) {
                resultado.push("instruct -> mientras(expMien oprel expMien){ instruct instruct* }");
                agregarRegla("expMien -> var || num");
                agregarRegla("oprel -> >= || <= || == || != || > || <");
                agregarRegla("var -> let (let||numV)*");
                agregarRegla("let -> A-Z || a-z");
                agregarRegla("numV -> dig dig*");
                agregarRegla("num -> (- || ∅ )(dig dig* || dig dig* .dig dig*) ");
                agregarRegla("dig -> 0-9");

                // --- Capturar bloque interno correctamente usando mientrasMatch ---
                let openBraces = 1;
                let i = mientrasMatch[0].length; // <-- usar mientrasMatch aquí
                while (i < resto.length && openBraces > 0) {
                    if (resto[i] === '{') openBraces++;
                    else if (resto[i] === '}') openBraces--;
                    i++;
                }

                // tomar el contenido entre las llaves y analizarlo
                let bloqueInterno = resto.slice(mientrasMatch[0].length, i - 1);
                analizarBloque(bloqueInterno);

                index += i;
                continue;
            }

            // ------------------ PARA ------------------
            let paraMatch = resto.match(/^para\s*\([^\)]+\)\s*\{/i);
            if (paraMatch) {
                resultado.push("instruct -> para(var = expPara; expPara oprel expPara; var++||var--){ instruct instruct* }");
                agregarRegla("expPara -> var || num");
                agregarRegla("oprel -> >= || <= || == || != || > || <");
                agregarRegla("var -> let (let||numV)*");
                agregarRegla("let -> A-Z || a-z");
                agregarRegla("numV -> dig dig*");
                agregarRegla("num -> (- || ∅ )(dig dig* || dig dig* .dig dig*) ");
                agregarRegla("dig -> 0-9");

                let openBraces = 1;
                let i = paraMatch[0].length;
                while (i < resto.length && openBraces > 0) {
                    if (resto[i] === '{') openBraces++;
                    else if (resto[i] === '}') openBraces--;
                    i++;
                }
                let bloqueInterno = resto.slice(paraMatch[0].length, i - 1);
                analizarBloque(bloqueInterno);
                index += i;
                continue;
            }

            // ------------------ FUNCION ------------------
            let funcionMatch = resto.match(/^funcion\s+[a-zA-Z_]\w*\s*\([^\)]*\)\s*\{/i);
            if (funcionMatch) {
                resultado.push("instruct -> funcion id(parametros){ instruct instruct* }");
                agregarRegla("id -> let (let||numV)*");
                agregarRegla("parametros -> (tipo var (, tipo var)*) || ε");
                agregarRegla("tipo -> entero || flotante || cadena || conEntero || conFlotante || conCadena || booleano");
                agregarRegla("var -> let (let||numV)*");
                agregarRegla("let -> A-Z || a-z");
                agregarRegla("numV -> dig dig*");
                agregarRegla("dig -> 0-9");
                

                let openBraces = 1;
                let i = funcionMatch[0].length;
                while (i < resto.length && openBraces > 0) {
                    if (resto[i] === '{') openBraces++;
                    else if (resto[i] === '}') openBraces--;
                    i++;
                }
                let bloqueInterno = resto.slice(funcionMatch[0].length, i - 1);
                analizarBloque(bloqueInterno);
                index += i;
                continue;
            }

            // ------------------ SELECCIONAR ------------------
            let seleccionarMatch = resto.match(/^seleccionar\s*\(\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\)\s*\{/i);
            if (seleccionarMatch) {
                const variable = seleccionarMatch[1].trim();

                // Regla estricta de salida
                resultado.push("instruct -> seleccionar(var){ caso (numV||var||texto||bool): instruct terminar; (caso (numV||var||texto||bool): instruct terminar;)* porDefecto: instruct instruct* terminar; }");

                // Reglas auxiliares
                agregarRegla("var -> let (let||numV)*");
                agregarRegla("let -> A-Z || a-z");
                agregarRegla("numV -> dig dig*");
                agregarRegla("dig -> 0-9");
                agregarRegla("texto -> \" let (let||numV||b)* \"");
                agregarRegla("bool -> verdadero || falso || true || false");

                // --- Capturar bloque interno ---
                let openBraces = 1;
                let i = seleccionarMatch[0].length;
                while (i < resto.length && openBraces > 0) {
                    if (resto[i] === '{') openBraces++;
                    else if (resto[i] === '}') openBraces--;
                    i++;
                }

                let bloqueInterno = resto.slice(seleccionarMatch[0].length, i - 1);

                // --- Analizar cada 'caso' y 'porDefecto' ---
                const casoRegex = /caso\s+([^\:]+)\s*:\s*([\s\S]*?)terminar;/gi;
                let match;
                while ((match = casoRegex.exec(bloqueInterno)) !== null) {
                    const instrucciones = match[2].trim();
                    // Analizar las instrucciones internas
                    analizarBloque(instrucciones);
                }

                const porDefectoRegex = /porDefecto\s*:\s*([\s\S]*?)terminar;/i;
                const porDefectoMatch = porDefectoRegex.exec(bloqueInterno);
                if (porDefectoMatch) {
                    const instruccionesPD = porDefectoMatch[1].trim();
                    // Analizar las instrucciones internas del porDefecto
                    analizarBloque(instruccionesPD);
                }

                index += i;
                continue;
            }


            // ------------------ DEFINIRCLASE ------------------
            let claseMatch = resto.match(/^definirClase\s+[A-Z][a-zA-Z0-9_]*\s*\{/i);
            if (claseMatch) {
                resultado.push("instruct -> definirClase(IdClase){ iniciar(parametros){ ESTE.var = var;* } metodo* }");
                agregarRegla("IdClase -> let (let||numV)*");
                agregarRegla("parametros -> (tipo var (, tipo var)*) || ε");
                agregarRegla("tipo -> entero || flotante || cadena || conEntero || conFlotante || conCadena || booleano");
                agregarRegla("var -> let (let||numV)*");
                agregarRegla("let -> A-Z || a-z");
                agregarRegla("numV -> dig dig*");
                agregarRegla("dig -> 0-9");
                
                let openBraces = 1;
                let i = claseMatch[0].length;
                while (i < resto.length && openBraces > 0) {
                    if (resto[i] === '{') openBraces++;
                    else if (resto[i] === '}') openBraces--;
                    i++;
                }
                let bloqueInterno = resto.slice(claseMatch[0].length, i - 1);
                analizarBloque(bloqueInterno);
                index += i;
                continue;
            }

            // ------------------ DIVIDIRCADENA ------------------
            let dividirMatch = resto.match(/^dividirCadena\s*\([^\)]+\);/i);
            if (dividirMatch) {
                resultado.push('instruct -> dividirCadena(expDivCad, exp);');
                agregarRegla("expDivCad -> var");
                agregarRegla("var -> let (let||numV)*");
                agregarRegla("let -> A-Z || a-z");
                agregarRegla("numV -> dig dig*");
                agregarRegla("dig -> 0-9");
                index += dividirMatch[0].length;
                continue;
            }

            // ------------------ FECHAACTUAL ------------------
            let fechaMatch = resto.match(/^fechaActual\s*\([^\)]+\);/i);
            if (fechaMatch) {
                resultado.push('instruct -> fechaActual("tipo_fecha");');
                agregarRegla('tipo_fecha -> dia || mes || año || hora || minuto || segundo');
                index += fechaMatch[0].length;
                continue;
            }

            // ------------------ EXISTE ------------------
            let existeMatch = resto.match(/^existe\s*\([^\)]+\);/i);
            if (existeMatch) {
                resultado.push('instruct -> existe((var || num), (var || num));');
                agregarRegla("var -> let (let||numV)*");
                agregarRegla("let -> A-Z || a-z");
                agregarRegla("numV -> dig dig*");
                agregarRegla("num -> (- || ∅ )(dig dig* || dig dig* .dig dig*) ");
                agregarRegla("dig -> 0-9");
                index += existeMatch[0].length;
                continue;
            }

            // ------------------ TAMAÑOCADENA ------------------
            let tamMatch = resto.match(/^tamañoCadena\s*\("[^"]*"\);/i);
            if (tamMatch) {
                resultado.push('instruct -> tamañoCadena("texto");');
                agregarRegla('texto -> let (let||num||b)*');
                agregarRegla("let -> A-Z || a-z");
                agregarRegla("num -> (- || ∅ )(dig dig* || dig dig* .dig dig*) ");
                agregarRegla("dig -> 0-9");
                index += tamMatch[0].length;
                continue;
            }

            // ------------------ PAUSARYREANUDARGENERADOR ------------------
            let pausaMatch = resto.match(/^PausaryReanudarGenerador\s*\([^\)]+\);/i);
            if (pausaMatch) {
                resultado.push('instruct -> PausaryReanudarGenerador(var);');
                agregarRegla("var -> let (let||numV)*");
                agregarRegla("let -> A-Z || a-z");
                agregarRegla("numV -> dig dig*");
                agregarRegla("dig -> 0-9");
                index += pausaMatch[0].length;
                continue;
            }

            // ------------------ AUTOEJECUTAR ------------------
            let autoMatch = resto.match(/^autoejecutar\s*\([^\)]+\);/i);
            if (autoMatch) {
                resultado.push('instruct -> autoejecutar(var, var);');
                agregarRegla("var -> let (let||numV)*");
                agregarRegla("let -> A-Z || a-z");
                agregarRegla("numV -> dig dig*");
                agregarRegla("dig -> 0-9");
                index += autoMatch[0].length;
                continue;
            }

            // ------------------ CAPTURAR ------------------
            let capturarMatch = resto.match(/^capturar\s*\(\s*([a-zA-Z_]\w*)\s*\);/i);
            if (capturarMatch) {
                resultado.push('instruct -> capturar(var);');
                agregarRegla("var -> let (let||numV)*");
                agregarRegla("let -> A-Z || a-z");
                agregarRegla("numV -> dig dig*");
                agregarRegla("dig -> 0-9");
                index += capturarMatch[0].length;
                continue;
            }

            // ------------------ ORDENAR ------------------
            let ordenarMatch = resto.match(/^ordenar\s*\([^\)]+\);/i);
            if (ordenarMatch) {
                resultado.push('instruct -> ordenar([expOrde (, expOrde*)*]);');
                agregarRegla("expOrde -> var || num");
                agregarRegla("var -> let (let||numV)*");
                agregarRegla("let -> A-Z || a-z");
                agregarRegla("numV -> dig dig*");
                agregarRegla("num -> (- || ∅ )(dig dig* || dig dig* .dig dig*) ");
                agregarRegla("dig -> 0-9");
                index += ordenarMatch[0].length;
                continue;
            }

            // ------------------ EQUIPO ------------------
            let equipoMatch = resto.match(/^equipo\s*\(\);/i);
            if (equipoMatch) {
                resultado.push('instruct -> equipo();');
                index += equipoMatch[0].length;
                continue;
            }

            // ------------------ OBTENERCARACTER ------------------
            let obtenerMatch = resto.match(/^obtenerCaracter\s*\([^\)]+\);/i);
            if (obtenerMatch) {
                resultado.push('instruct -> obtenerCaracter(expObtCarac, num);');
                agregarRegla("expObtCarac -> var || num");
                agregarRegla("var -> let (let||numV)*");
                agregarRegla("let -> A-Z || a-z");
                agregarRegla("numV -> dig dig*");
                agregarRegla("num -> (- || ∅ )(dig dig* || dig dig* .dig dig*) ");
                agregarRegla("dig -> 0-9");
                index += obtenerMatch[0].length;
                continue;
            }

            // ------------------ ASIGNACIÓN O EXPRESIÓN ARITMÉTICA ------------------
            let asignacionMatch = resto.match(/^([a-zA-Z_]\w*(\[\s*\d+\s*\])?)\s*=\s*([^;]+);/i);
            if (asignacionMatch) {
                const variable = asignacionMatch[1].trim();
                let expresion = asignacionMatch[3].trim();

                // Operadores válidos (sin '!')
                const operadoresOpera = [
                    '>=', '<=', '==', '!=', '&&', '||',
                    '+', '-', '*', '/', '%', '^', '>', '<'
                ];

                // Detectar operadores usados
                const operadoresUsados = new Set();
                for (const op of operadoresOpera) {
                    if (expresion.includes(op)) operadoresUsados.add(op);
                }

                // Reemplazar variables, índices y números por 'expAsig'
                let expFormada = expresion
                    // variables con índice -> expAsig
                    .replace(/\b[A-Za-z_]\w*\s*\[\s*\d+\s*\]/g, 'expAsig')
                    // variables simples -> expAsig
                    .replace(/\b[A-Za-z_]\w*\b/g, 'expAsig')
                    // números -> expAsig
                    .replace(/\b\d+(\.\d+)?\b/g, 'expAsig');

                // Reemplazar operadores por 'opera'
                const operadoresOrdenados = Array.from(operadoresUsados).sort((a,b) => b.length - a.length);
                for (const op of operadoresOrdenados) {
                    const opEsc = op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(`\\s*${opEsc}\\s*`, 'g');
                    expFormada = expFormada.replace(regex, ' opera ');
                }

                expFormada = expFormada.replace(/\s+/g, ' ').trim();

                // ------------------ Salida ------------------
                if (variable.includes("[")) {
                    resultado.push("instruct -> var[numV] = exp;");
                } else {
                    resultado.push("instruct -> var = exp;");
                }
                resultado.push(`exp -> ${expFormada}`);
                if (operadoresUsados.size > 0) {
                    resultado.push(`opera -> ${Array.from(operadoresUsados).join(" || ")}`);
                } else {
                    resultado.push("opera -> (sin operadores)");
                }

                // Reglas base
                agregarRegla("expAsig -> var || num || var[numV]");
                agregarRegla("var -> let (let||numV)*");
                agregarRegla("let -> A-Z || a-z");
                agregarRegla("numV -> dig dig*");
                agregarRegla("num -> (- || ∅ )(dig dig* || dig dig* .dig dig*) ");
                agregarRegla("dig -> 0-9");

                index += asignacionMatch[0].length;
                continue;
            }

            // ------------------ No reconocido ------------------
            let nextSemicolon = resto.indexOf(';');
            if (nextSemicolon !== -1) {
                index += nextSemicolon + 1;
            } else {
                break;
            }
        }
    }

    analizarBloque(codigo);

    // Agregar todas las reglas únicas al final
    reglas.forEach(r => resultado.push(r));

    return resultado.join("\n");
}

    analizarSemanticoBtn.addEventListener("click", () => {
        const codigo = input.value.trim();
        if (codigo === "") {
            resultBox.value = "Por favor ingresa el código a analizar.";
            return;
        }
        const resultado = analizarSemanticoCompleto(codigo);
        resultBox.value = resultado;
    });
});