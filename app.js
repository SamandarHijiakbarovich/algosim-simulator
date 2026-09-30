document.addEventListener('DOMContentLoaded', () => {
    // UI elementlar
    const algoSelect = document.getElementById('algoSelect');
    const groupAB = document.getElementById('groupAB');
    const groupN = document.getElementById('groupN');
    const groupArray = document.getElementById('groupArray');

    const inputA = document.getElementById('inputA');
    const inputB = document.getElementById('inputB');
    const inputN = document.getElementById('inputN');
    const inputArray = document.getElementById('inputArray');

    const codeStepsEl = document.getElementById('codeSteps');
    const flowchartNodesEl = document.getElementById('flowchartNodes');
    const ramContainerEl = document.getElementById('ramContainer');
    const outputLogEl = document.getElementById('outputLog');

    const btnStart = document.getElementById('btnStart');
    const btnAuto = document.getElementById('btnAuto');
    const btnStep = document.getElementById('btnStep');
    const btnReset = document.getElementById('btnReset');
    const speedRange = document.getElementById('speedRange');
    const langBtns = document.querySelectorAll('.lang-btn');

    let currentLanguage = 'CSharp';
    let simulationSteps = [];
    let currentStepIndex = -1;
    let autoInterval = null;

    // Til almashtirish
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLanguage = btn.dataset.lang || btn.innerText;
            resetSimulation();
            renderCode();
        });
    });

    // Algoritm o'zgarganda input guruhlarini ko'rsatish/yashirish
    algoSelect.addEventListener('change', () => {
        const val = algoSelect.value;
        groupAB.style.display = 'none';
        groupN.style.display = 'none';
        groupArray.style.display = 'none';

        if (['sum_ab', 'max_two', 'power'].includes(val)) {
            groupAB.style.display = 'block';
        } else if (['even_odd', 'loop_sum', 'factorial', 'is_prime', 'fibonacci'].includes(val)) {
            groupN.style.display = 'block';
        } else if (['array_max', 'array_sum'].includes(val)) {
            groupArray.style.display = 'block';
        }
        resetSimulation();
    });

    // Algoritmlar bo'yicha Kodlar va Qadamlar Generatorlari
    function generateSteps() {
        const type = algoSelect.value;
        const steps = [];

        if (type === 'sum_ab') {
            const a = parseFloat(inputA.value) || 0;
            const b = parseFloat(inputB.value) || 0;
            
            steps.push({ line: 0, ram: { a, b }, log: "O'zgaruvchilar kiritildi." });
            steps.push({ line: 1, ram: { a, b, sum: a + b }, log: `Summa hisoblandi: ${a} + ${b} = ${a + b}` });
            steps.push({ line: 2, ram: { a, b, sum: a + b }, log: `Natija: ${a + b}` });

        } else if (type === 'even_odd') {
            const n = parseInt(inputN.value) || 0;
            steps.push({ line: 0, ram: { n }, log: `N = ${n} kiritildi.` });
            steps.push({ line: 1, ram: { n, rem: n % 2 }, log: `${n} % 2 == ${n % 2} shart tekshirilmoqda.` });
            if (n % 2 === 0) {
                steps.push({ line: 2, ram: { n, result: "Juft" }, log: `${n} soni JUFT.` });
            } else {
                steps.push({ line: 3, ram: { n, result: "Toq" }, log: `${n} soni TOQ.` });
            }

        } else if (type === 'max_two') {
            const a = parseFloat(inputA.value) || 0;
            const b = parseFloat(inputB.value) || 0;
            steps.push({ line: 0, ram: { a, b }, log: "A va B qabul qilindi." });
            steps.push({ line: 1, ram: { a, b }, log: `Shart: ${a} > ${b}?` });
            if (a > b) {
                steps.push({ line: 2, ram: { a, b, max: a }, log: `A katta! Max = ${a}` });
            } else {
                steps.push({ line: 3, ram: { a, b, max: b }, log: `B katta yoki teng! Max = ${b}` });
            }

        } else if (type === 'loop_sum') {
            const n = parseInt(inputN.value) || 5;
            let sum = 0;
            steps.push({ line: 0, ram: { sum: 0, limit: n }, log: "sum = 0 va limit belgilandi." });
            for (let i = 1; i <= n; i++) {
                sum += i;
                steps.push({ line: 1, ram: { sum, i, limit: n }, log: `Sikl i=${i}: sum=${sum}` });
            }
            steps.push({ line: 2, ram: { sum, limit: n }, log: `Yakuniy Yig'indi: ${sum}` });

        } else if (type === 'factorial') {
            const n = parseInt(inputN.value) || 5;
            let fact = 1;
            steps.push({ line: 0, ram: { fact: 1, n }, log: "fact = 1 va n belgilandi." });
            for (let i = 1; i <= n; i++) {
                fact *= i;
                steps.push({ line: 1, ram: { fact, i, n }, log: `Sikl i=${i}: fact = ${fact}` });
            }
            steps.push({ line: 2, ram: { fact, n }, log: `${n}! = ${fact}` });

        } else if (type === 'power') {
            const a = parseFloat(inputA.value) || 2;
            const b = parseInt(inputB.value) || 3;
            let res = 1;
            steps.push({ line: 0, ram: { res: 1, base: a, exp: b }, log: `Asos=${a}, Daraja=${b}` });
            for (let i = 1; i <= b; i++) {
                res *= a;
                steps.push({ line: 1, ram: { res, i, base: a, exp: b }, log: `Qadam ${i}: res = ${res}` });
            }
            steps.push({ line: 2, ram: { res, base: a, exp: b }, log: `Natija: ${a}^${b} = ${res}` });

        } else if (type === 'is_prime') {
            const n = parseInt(inputN.value) || 7;
            let isPrime = n > 1;
            steps.push({ line: 0, ram: { n, isPrime: true }, log: `N = ${n} tekshirilmoqda.` });
            if (n <= 1) {
                steps.push({ line: 3, ram: { n, isPrime: false }, log: `${n} tub son emas.` });
            } else {
                let foundDiv = false;
                for (let i = 2; i <= Math.sqrt(n); i++) {
                    steps.push({ line: 1, ram: { n, i }, log: `Tekshiruv: ${n} % ${i} == 0?` });
                    if (n % i === 0) {
                        foundDiv = true;
                        steps.push({ line: 2, ram: { n, i, isPrime: false }, log: `${i} ga bo'lindi! Tub emas.` });
                        break;
                    }
                }
                if (!foundDiv) {
                    steps.push({ line: 3, ram: { n, isPrime: true }, log: `${n} TUB SON!` });
                }
            }

        } else if (type === 'fibonacci') {
            const n = parseInt(inputN.value) || 6;
            let a = 0, b = 1;
            steps.push({ line: 0, ram: { a: 0, b: 1, count: n }, log: "A=0, B=1 boshlang'ich qiymatlar." });
            for (let i = 2; i <= n; i++) {
                let next = a + b;
                a = b;
                b = next;
                steps.push({ line: 1, ram: { a, b, next, step: i }, log: `${i}-had: ${b}` });
            }
            steps.push({ line: 2, ram: { result: b }, log: `${n}-Fibonachchi soni: ${b}` });

        } else if (type === 'array_max') {
            const arr = inputArray.value.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
            if (arr.length === 0) arr.push(0);
            let max = arr[0];
            steps.push({ line: 0, ram: { arr: `[${arr.join(', ')}]`, max }, log: `Massiv: [${arr.join(', ')}], Max=${max}` });
            for (let i = 1; i < arr.length; i++) {
                steps.push({ line: 1, ram: { arr: `[${arr.join(', ')}]`, max, i, val: arr[i] }, log: `Tekshiruv: arr[${i}] = ${arr[i]} > ${max}?` });
                if (arr[i] > max) {
                    max = arr[i];
                    steps.push({ line: 2, ram: { arr: `[${arr.join(', ')}]`, max }, log: `Yangi MAX topildi: ${max}` });
                }
            }
            steps.push({ line: 3, ram: { max }, log: `Eng katta element: ${max}` });

        } else if (type === 'array_sum') {
            const arr = inputArray.value.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
            let sum = 0;
            steps.push({ line: 0, ram: { arr: `[${arr.join(', ')}]`, sum: 0 }, log: "sum = 0" });
            for (let i = 0; i < arr.length; i++) {
                sum += arr[i];
                steps.push({ line: 1, ram: { arr: `[${arr.join(', ')}]`, sum, i, val: arr[i] }, log: `arr[${i}] = ${arr[i]} qo'shildi. Sum = ${sum}` });
            }
            steps.push({ line: 2, ram: { sum }, log: `Jami yig'indi: ${sum}` });
        }

        return steps;
    }

    // Kod matnlarini olish (Tanlangan tilga mos)
    function getCodeLines() {
        const type = algoSelect.value;
        const lang = currentLanguage;

        const templates = {
            sum_ab: {
                CSharp: ["int a = inputA, b = inputB;", "int sum = a + b;", "Console.WriteLine(sum);"],
                Python: ["a, b = inputA, inputB", "sum = a + b", "print(sum)"],
                Cpp: ["int a = inputA, b = inputB;", "int sum = a + b;", "cout << sum << endl;"],
                Pseudo: ["A va B ni kiritish", "Sum = A + B", "Sum ni chiqarish"]
            },
            even_odd: {
                CSharp: ["int n = inputN;", "if (n % 2 == 0)", "   Console.WriteLine(\"Juft\");", "else Console.WriteLine(\"Toq\");"],
                Python: ["n = inputN", "if n % 2 == 0:", "    print('Juft')", "else: print('Toq')"],
                Cpp: ["int n = inputN;", "if (n % 2 == 0) cout << \"Juft\";", "else cout << \"Toq\";"],
                Pseudo: ["N ni kiritish", "Agar N % 2 == 0 bo'lsa", "   'Juft' deb chiqar", "Aks holda 'Toq' deb chiqar"]
            },
            max_two: {
                CSharp: ["int a = inputA, b = inputB;", "if (a > b)", "   int max = a;", "else int max = b;"],
                Python: ["a, b = inputA, inputB", "if a > b:", "    max_val = a", "else: max_val = b"],
                Cpp: ["int a = inputA, b = inputB;", "if (a > b) max = a;", "else max = b;"],
                Pseudo: ["A va B kiritilsin", "Agar A > B bo'lsa", "   Max = A", "Aks holda Max = B"]
            },
            loop_sum: {
                CSharp: ["int sum = 0;", "for (int i = 1; i <= n; i++) sum += i;", "Console.WriteLine(sum);"],
                Python: ["sum = 0", "for i in range(1, n + 1): sum += i", "print(sum)"],
                Cpp: ["int sum = 0;", "for (int i = 1; i <= n; i++) sum += i;", "cout << sum;"],
                Pseudo: ["sum = 0", "i ni 1 dan N gacha oshirib sum += i bajar", "sum ni chiqar"]
            },
            factorial: {
                CSharp: ["long fact = 1;", "for (int i = 1; i <= n; i++) fact *= i;", "Console.WriteLine(fact);"],
                Python: ["fact = 1", "for i in range(1, n + 1): fact *= i", "print(fact)"],
                Cpp: ["long long fact = 1;", "for (int i = 1; i <= n; i++) fact *= i;", "cout << fact;"],
                Pseudo: ["fact = 1", "i ni 1 dan N gacha oshirib fact *= i bajar", "fact ni chiqar"]
            },
            power: {
                CSharp: ["double res = 1;", "for (int i = 1; i <= b; i++) res *= a;", "Console.WriteLine(res);"],
                Python: ["res = 1", "for i in range(b): res *= a", "print(res)"],
                Cpp: ["double res = 1;", "for (int i = 1; i <= b; i++) res *= a;", "cout << res;"],
                Pseudo: ["res = 1", "b marta res = res * a bajar", "res ni chiqar"]
            },
            is_prime: {
                CSharp: ["bool isPrime = true;", "for (int i = 2; i <= Math.Sqrt(n); i++)", "   if (n % i == 0) isPrime = false;", "Console.WriteLine(isPrime);"],
                Python: ["isPrime = True", "for i in range(2, int(n**0.5) + 1):", "    if n % i == 0: isPrime = False", "print(isPrime)"],
                Cpp: ["bool isPrime = true;", "for (int i=2; i*i<=n; i++) if(n%i==0) isPrime=false;", "cout << isPrime;"],
                Pseudo: ["isPrime = True", "i ni 2 dan sqrt(N) gacha tekshir", "Agar bo'linsa isPrime = False", "isPrime ni chiqar"]
            },
            fibonacci: {
                CSharp: ["int a = 0, b = 1;", "for (int i = 2; i <= n; i++) { int c = a + b; a = b; b = c; }", "Console.WriteLine(b);"],
                Python: ["a, b = 0, 1", "for _ in range(2, n + 1): a, b = b, a + b", "print(b)"],
                Cpp: ["int a = 0, b = 1;", "for (int i = 2; i <= n; i++) { int c = a + b; a = b; b = c; }", "cout << b;"],
                Pseudo: ["A=0, B=1", "N marta A va B ni yangilab bor", "B ni chiqar"]
            },
            array_max: {
                CSharp: ["int max = arr[0];", "for (int i = 1; i < arr.Length; i++)", "   if (arr[i] > max) max = arr[i];", "Console.WriteLine(max);"],
                Python: ["max_val = arr[0]", "for x in arr[1:]:", "    if x > max_val: max_val = x", "print(max_val)"],
                Cpp: ["int max = arr[0];", "for (int i = 1; i < size; i++) if (arr[i] > max) max = arr[i];", "cout << max;"],
                Pseudo: ["max = arr[0]", "Har bir element uchun: agar element > max bo'lsa", "max = element", "max ni chiqar"]
            },
            array_sum: {
                CSharp: ["int sum = 0;", "for (int i = 0; i < arr.Length; i++) sum += arr[i];", "Console.WriteLine(sum);"],
                Python: ["sum_val = 0", "for x in arr: sum_val += x", "print(sum_val)"],
                Cpp: ["int sum = 0;", "for (int i = 0; i < size; i++) sum += arr[i];", "cout << sum;"],
                Pseudo: ["sum = 0", "Har bir elementni sum ga qo'sh", "sum ni chiqar"]
            }
        };

        return templates[type][lang] || templates[type]['CSharp'];
    }

    function renderCode() {
        const lines = getCodeLines();
        codeStepsEl.innerHTML = '';
        lines.forEach((lineText, idx) => {
            const div = document.createElement('div');
            div.className = 'code-line';
            div.id = `line-${idx}`;
            div.innerText = lineText;
            codeStepsEl.appendChild(div);
        });
    }

    function renderRAM(ramState) {
        ramContainerEl.innerHTML = '';
        if (!ramState) return;
        
        for (const [key, val] of Object.entries(ramState)) {
            const box = document.createElement('div');
            box.className = 'ram-box';
            box.innerHTML = `
                <span class="ram-var">${key}</span>
                <span class="ram-val">${val}</span>
            `;
            ramContainerEl.appendChild(box);
        }
    }

    function updateStepUI() {
        if (currentStepIndex < 0 || currentStepIndex >= simulationSteps.length) return;

        const step = simulationSteps[currentStepIndex];

        // Kod qatorini ajratib ko'rsatish
        document.querySelectorAll('.code-line').forEach(el => el.classList.remove('active-line'));
        const activeLineEl = document.getElementById(`line-${step.line}`);
        if (activeLineEl) activeLineEl.classList.add('active-line');

        // RAM holatini yangilash
        renderRAM(step.ram);

        // Terminal Output yangilash
        outputLogEl.innerText = step.log;
    }

    function resetSimulation() {
        if (autoInterval) clearInterval(autoInterval);
        autoInterval = null;
        currentStepIndex = -1;
        simulationSteps = [];
        renderCode();
        renderRAM({});
        outputLogEl.innerText = "Simulyatsiya kutilmoqda...";
        document.querySelectorAll('.code-line').forEach(el => el.classList.remove('active-line'));
    }

    // Boshqaruv tugmalari hodisalari
    btnStart.addEventListener('click', () => {
        resetSimulation();
        simulationSteps = generateSteps();
        if (simulationSteps.length > 0) {
            currentStepIndex = 0;
            updateStepUI();
        }
    });

    btnStep.addEventListener('click', () => {
        if (simulationSteps.length === 0) {
            simulationSteps = generateSteps();
        }
        if (currentStepIndex < simulationSteps.length - 1) {
            currentStepIndex++;
            updateStepUI();
        }
    });

    btnAuto.addEventListener('click', () => {
        if (autoInterval) {
            clearInterval(autoInterval);
            autoInterval = null;
            btnAuto.innerText = "⚡ Avto-ijro";
            return;
        }

        if (simulationSteps.length === 0) {
            simulationSteps = generateSteps();
        }

        btnAuto.innerText = "⏸ To'xtatish";
        const speed = parseFloat(speedRange.value) || 1;
        const delay = 1200 / speed;

        autoInterval = setInterval(() => {
            if (currentStepIndex < simulationSteps.length - 1) {
                currentStepIndex++;
                updateStepUI();
            } else {
                clearInterval(autoInterval);
                autoInterval = null;
                btnAuto.innerText = "⚡ Avto-ijro";
            }
        }, delay);
    });

    btnReset.addEventListener('click', resetSimulation);

    // Dastlabki yuklanish
    renderCode();
});