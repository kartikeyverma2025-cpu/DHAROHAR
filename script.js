function searchArts() {

        let input =
            document.getElementById("searchInput")
            .value
            .toLowerCase();

        let cards =
            document.querySelectorAll(".art-card");

        cards.forEach(function(card) {

            let name =
                card.getAttribute("data-name")
                .toLowerCase();

            if (name.includes(input)) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });

    }


    document
        .getElementById("searchInput")
        .addEventListener("keyup", function() {

            searchArts();

        });


    // Simple reveal animation

    const elements =
        document.querySelectorAll(
            ".category, .art-card, .preserve-card, .archive-item, .challenge, .game-hero-banner, .ps-card, .mech-card"
        );

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";

                    }

                });

            },
            {
                threshold: 0.1
            }
        );


    elements.forEach(element => {

        element.style.opacity = "0";
        element.style.transform = "translateY(30px)";
        element.style.transition = "0.7s";

        observer.observe(element);

    });

    /* ================= GAME ENGINE SCRIPT ================= */

    const gameQuestions = [
        {
            question: "Which ancient Indus Valley site is famous for its elaborate dockyard and maritime trade?",
            options: ["Mohenjo-daro", "Lothal", "Kalibangan", "Harappa"],
            correct: 1,
            info: "Lothal in Gujarat had the world's earliest known dockyard, connecting the Indus Valley to ancient Mesopotamia."
        },
        {
            question: "Which Chola emperor built the iconic Brihadisvara Temple at Thanjavur?",
            options: ["Rajendra Chola I", "Raja Raja Chola I", "Karikala Chola", "Parantaka I"],
            correct: 1,
            info: "Raja Raja Chola I commissioned the Brihadisvara Temple in 1010 CE, a pinnacle of Dravidian architecture."
        },
        {
            question: "The classical art form 'Madhubani Painting' traditionally originates from which Indian state?",
            options: ["Rajasthan", "Odisha", "Bihar", "West Bengal"],
            correct: 2,
            info: "Madhubani art originated in the Mithila region of Bihar, characterized by complex geometrical patterns."
        },
        {
            question: "In classical Indian dance, what are 'Mudras' primarily used for?",
            options: ["Rhythmic Footwork", "Hand Gestures & Storytelling", "Stage Decoration", "Vocal Accompaniment"],
            correct: 1,
            info: "Mudras are stylized hand gestures used to communicate emotions, objects, and narrative themes."
        }
    ];

    let currentQuestionIndex = 0;
    let praan = 5;
    let mudra = 0;
    let streak = 1;
    let answered = false;

    const startGameBtn = document.getElementById("startGameBtn");
    const gameModal = document.getElementById("gameModal");
    const closeGameBtn = document.getElementById("closeGameBtn");
    const questionText = document.getElementById("questionText");
    const optionsGrid = document.getElementById("optionsGrid");
    const gameFeedback = document.getElementById("gameFeedback");
    const nextQuestionBtn = document.getElementById("nextQuestionBtn");

    const gamePraan = document.getElementById("gamePraan");
    const gameMudra = document.getElementById("gameMudra");
    const gameStreak = document.getElementById("gameStreak");

    startGameBtn.addEventListener("click", () => {
        praan = 5;
        mudra = 0;
        currentQuestionIndex = 0;
        updateStats();
        loadQuestion();
        gameModal.style.display = "flex";
    });

    closeGameBtn.addEventListener("click", () => {
        gameModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === gameModal) {
            gameModal.style.display = "none";
        }
    });

    function updateStats() {
        gamePraan.textContent = praan;
        gameMudra.textContent = mudra;
        gameStreak.textContent = streak;
    }

    function loadQuestion() {
        answered = false;
        gameFeedback.className = "game-feedback";
        gameFeedback.style.display = "none";
        nextQuestionBtn.style.display = "none";

        if (currentQuestionIndex >= gameQuestions.length) {
            questionText.textContent = "🎉 Quest Completed!";
            optionsGrid.innerHTML = `<p style='text-align:center; padding: 20px 0;'>You mastered this Heritage Quest! Earned <b>${mudra} Mudra Gold</b>.</p>`;
            nextQuestionBtn.textContent = "Play Again 🔄";
            nextQuestionBtn.style.display = "block";
            nextQuestionBtn.onclick = () => {
                currentQuestionIndex = 0;
                praan = 5;
                mudra = 0;
                updateStats();
                loadQuestion();
            };
            return;
        }

        const q = gameQuestions[currentQuestionIndex];
        questionText.textContent = `Quest ${currentQuestionIndex + 1}: ${q.question}`;
        optionsGrid.innerHTML = "";

        q.options.forEach((opt, idx) => {
            const btn = document.createElement("button");
            btn.className = "option-btn";
            btn.innerHTML = `<span style="color:#e5a23c; font-weight:bold;">${String.fromCharCode(65 + idx)}.</span> ${opt}`;
            btn.addEventListener("click", () => checkAnswer(idx, btn));
            optionsGrid.appendChild(btn);
        });
    }

    function checkAnswer(selectedIndex, selectedBtn) {
        if (answered) return;
        answered = true;

        const q = gameQuestions[currentQuestionIndex];
        const allButtons = optionsGrid.children;

        if (selectedIndex === q.correct) {
            selectedBtn.classList.add("correct");
            mudra += 20;
            gameFeedback.textContent = `✨ Correct! ${q.info}`;
            gameFeedback.className = "game-feedback success";
        } else {
            selectedBtn.classList.add("wrong");
            allButtons[q.correct].classList.add("correct");
            praan = Math.max(0, praan - 1);
            gameFeedback.textContent = `❌ Not quite. ${q.info}`;
            gameFeedback.className = "game-feedback error";
        }

        updateStats();

        if (praan <= 0) {
            setTimeout(() => {
                questionText.textContent = "💔 Out of Praan (Hearts)!";
                optionsGrid.innerHTML = "<p style='text-align:center; padding: 20px 0;'>Review your history notes and try again!</p>";
                gameFeedback.style.display = "none";
                nextQuestionBtn.textContent = "Restart Quest 🔄";
                nextQuestionBtn.style.display = "block";
                nextQuestionBtn.onclick = () => {
                    currentQuestionIndex = 0;
                    praan = 5;
                    mudra = 0;
                    updateStats();
                    loadQuestion();
                };
            }, 1200);
            return;
        }

        nextQuestionBtn.textContent = "Next Question ➔";
        nextQuestionBtn.style.display = "block";
        nextQuestionBtn.onclick = () => {
            currentQuestionIndex++;
            loadQuestion();
        };
    }

    /* ================= INDIA HERITAGE MAP ================= */

    const stateHeritageData = {
        jk: {
            name: "Jammu & Kashmir",
            region: "Northern India",
            wiki: "https://en.wikipedia.org/wiki/Jammu_and_Kashmir",
            blurb: "A Himalayan region famed for Mughal gardens, ancient temples and centuries of Sufi and Kashmiri craft traditions.",
            monuments: [
                { name: "Shalimar Bagh", note: "17th-century Mughal terraced garden built by Emperor Jahangir in Srinagar.", wiki: "https://en.wikipedia.org/wiki/Shalimar_Bagh,_Srinagar" },
                { name: "Martand Sun Temple", note: "8th-century ruined sun temple showcasing early Kashmiri architecture.", wiki: "https://en.wikipedia.org/wiki/Martand_Sun_Temple" },
                { name: "Hari Parbat Fort", note: "Hilltop fort overlooking Srinagar, built during Afghan rule.", wiki: "https://en.wikipedia.org/wiki/Hari_Parbat" }
            ]
        },
        punjab: {
            name: "Punjab",
            region: "Northern India",
            wiki: "https://en.wikipedia.org/wiki/Punjab,_India",
            blurb: "Home of Sikh heritage, vibrant Bhangra folk culture and sites central to India's freedom movement.",
            monuments: [
                { name: "Golden Temple", note: "Sikhism's holiest shrine in Amritsar, gilded and surrounded by a sacred tank.", wiki: "https://en.wikipedia.org/wiki/Golden_Temple" },
                { name: "Jallianwala Bagh", note: "Historic memorial garden marking a pivotal moment in India's independence struggle.", wiki: "https://en.wikipedia.org/wiki/Jallianwala_Bagh" },
                { name: "Anandpur Sahib Fort", note: "Sacred Sikh complex linked to the founding of the Khalsa.", wiki: "https://en.wikipedia.org/wiki/Anandpur_Sahib" }
            ]
        },
        rajasthan: {
            name: "Rajasthan",
            region: "Northern India",
            wiki: "https://en.wikipedia.org/wiki/Rajasthan",
            blurb: "The land of forts and Rajput valour, known for desert palaces, vivid textiles and epic architecture.",
            monuments: [
                { name: "Amer Fort", note: "Hilltop fort-palace near Jaipur famed for its mirror work and ramparts.", wiki: "https://en.wikipedia.org/wiki/Amer_Fort" },
                { name: "Hawa Mahal", note: "Iconic honeycomb-facade palace built for royal women to view street life.", wiki: "https://en.wikipedia.org/wiki/Hawa_Mahal" },
                { name: "Jaisalmer Fort", note: "Living desert fort of golden sandstone, still home to a bustling settlement.", wiki: "https://en.wikipedia.org/wiki/Jaisalmer_Fort" }
            ]
        },
        up: {
            name: "Uttar Pradesh",
            region: "Northern India",
            wiki: "https://en.wikipedia.org/wiki/Uttar_Pradesh",
            blurb: "A cradle of civilizations along the Ganga, blending Mughal grandeur with ancient Buddhist heritage.",
            monuments: [
                { name: "Taj Mahal", note: "17th-century marble mausoleum in Agra, a UNESCO World Heritage masterpiece.", wiki: "https://en.wikipedia.org/wiki/Taj_Mahal" },
                { name: "Fatehpur Sikri", note: "Mughal Emperor Akbar's short-lived red sandstone capital city.", wiki: "https://en.wikipedia.org/wiki/Fatehpur_Sikri" },
                { name: "Sarnath", note: "Site near Varanasi where Buddha delivered his first sermon.", wiki: "https://en.wikipedia.org/wiki/Sarnath" }
            ]
        },
        bihar: {
            name: "Bihar",
            region: "Eastern India",
            wiki: "https://en.wikipedia.org/wiki/Bihar",
            blurb: "The heartland of ancient learning and spirituality, where Buddhism and classical education flourished.",
            monuments: [
                { name: "Mahabodhi Temple", note: "Site in Bodh Gaya where Buddha attained enlightenment; a UNESCO landmark.", wiki: "https://en.wikipedia.org/wiki/Mahabodhi_Temple" },
                { name: "Nalanda Ruins", note: "Remains of one of the world's earliest residential universities.", wiki: "https://en.wikipedia.org/wiki/Nalanda" },
                { name: "Vikramshila", note: "Ruins of an ancient Buddhist monastic university founded by Pala rulers.", wiki: "https://en.wikipedia.org/wiki/Vikramashila" }
            ]
        },
        assam: {
            name: "Assam",
            region: "Northeast India",
            wiki: "https://en.wikipedia.org/wiki/Assam",
            blurb: "Gateway to the Northeast, rich in Ahom-era architecture, tea heritage and sacred Shakti temples.",
            monuments: [
                { name: "Kamakhya Temple", note: "Ancient Shakti Peetha temple on Nilachal Hill in Guwahati.", wiki: "https://en.wikipedia.org/wiki/Kamakhya_Temple" },
                { name: "Rang Ghar", note: "17th-century Ahom amphitheatre, among Asia's oldest pavilions of its kind.", wiki: "https://en.wikipedia.org/wiki/Rang_Ghar" },
                { name: "Sivasagar Monuments", note: "Cluster of Ahom-era tanks, temples and palaces from the former capital.", wiki: "https://en.wikipedia.org/wiki/Sivasagar" }
            ]
        },
        gujarat: {
            name: "Gujarat",
            region: "Western India",
            wiki: "https://en.wikipedia.org/wiki/Gujarat",
            blurb: "A land of stepwells, coastal trade history and intricate stone carving traditions.",
            monuments: [
                { name: "Rani ki Vav", note: "Elaborately carved 11th-century stepwell in Patan, a UNESCO site.", wiki: "https://en.wikipedia.org/wiki/Rani_ki_Vav" },
                { name: "Sun Temple, Modhera", note: "11th-century temple aligned to capture the equinox sunrise.", wiki: "https://en.wikipedia.org/wiki/Sun_Temple,_Modhera" },
                { name: "Somnath Temple", note: "One of the twelve sacred Jyotirlinga shrines, rebuilt several times through history.", wiki: "https://en.wikipedia.org/wiki/Somnath_temple" }
            ]
        },
        mp: {
            name: "Madhya Pradesh",
            region: "Central India",
            wiki: "https://en.wikipedia.org/wiki/Madhya_Pradesh",
            blurb: "The heart of India, home to some of the subcontinent's finest temple sculpture and Buddhist stupas.",
            monuments: [
                { name: "Khajuraho Temples", note: "Group of medieval temples renowned for intricate sculptural artistry.", wiki: "https://en.wikipedia.org/wiki/Khajuraho_Group_of_Monuments" },
                { name: "Sanchi Stupa", note: "Ancient Buddhist monument commissioned by Emperor Ashoka.", wiki: "https://en.wikipedia.org/wiki/Sanchi" },
                { name: "Gwalior Fort", note: "Imposing hilltop fort described as the 'pearl among fortresses in India'.", wiki: "https://en.wikipedia.org/wiki/Gwalior_Fort" }
            ]
        },
        wb: {
            name: "West Bengal",
            region: "Eastern India",
            wiki: "https://en.wikipedia.org/wiki/West_Bengal",
            blurb: "A hub of colonial history, literary heritage and the mangrove wilderness of the Sundarbans.",
            monuments: [
                { name: "Victoria Memorial", note: "Grand marble monument in Kolkata commemorating the colonial era.", wiki: "https://en.wikipedia.org/wiki/Victoria_Memorial,_Kolkata" },
                { name: "Sundarbans", note: "UNESCO-listed mangrove forest and tiger reserve shared with Bangladesh.", wiki: "https://en.wikipedia.org/wiki/Sundarbans" },
                { name: "Belur Math", note: "Headquarters of the Ramakrishna Mission, blending architectural styles.", wiki: "https://en.wikipedia.org/wiki/Belur_Math" }
            ]
        },
        odisha: {
            name: "Odisha",
            region: "Eastern India",
            wiki: "https://en.wikipedia.org/wiki/Odisha",
            blurb: "Known for magnificent temple architecture and centuries-old Jagannath traditions.",
            monuments: [
                { name: "Konark Sun Temple", note: "13th-century temple shaped like a colossal chariot of the sun god.", wiki: "https://en.wikipedia.org/wiki/Konark_Sun_Temple" },
                { name: "Jagannath Temple, Puri", note: "One of India's most revered pilgrimage sites, host to the annual Rath Yatra.", wiki: "https://en.wikipedia.org/wiki/Jagannath_Temple,_Puri" },
                { name: "Udayagiri & Khandagiri Caves", note: "Ancient rock-cut caves carved for Jain ascetics.", wiki: "https://en.wikipedia.org/wiki/Udayagiri_and_Khandagiri_Caves" }
            ]
        },
        maharashtra: {
            name: "Maharashtra",
            region: "Western India",
            wiki: "https://en.wikipedia.org/wiki/Maharashtra",
            blurb: "Home to India's finest rock-cut cave art and a legacy shaped by the Maratha Empire.",
            monuments: [
                { name: "Ajanta Caves", note: "Ancient rock-cut Buddhist caves with masterful murals, a UNESCO site.", wiki: "https://en.wikipedia.org/wiki/Ajanta_Caves" },
                { name: "Gateway of India", note: "Iconic arch monument overlooking the Mumbai harbour.", wiki: "https://en.wikipedia.org/wiki/Gateway_of_India" },
                { name: "Shaniwar Wada", note: "Historic fortified palace that once seated the Maratha Peshwas.", wiki: "https://en.wikipedia.org/wiki/Shaniwar_Wada" }
            ]
        },
        telangana: {
            name: "Telangana",
            region: "Southern India",
            wiki: "https://en.wikipedia.org/wiki/Telangana",
            blurb: "A blend of Deccan Sultanate grandeur and refined Kakatiya-era temple craftsmanship.",
            monuments: [
                { name: "Charminar", note: "16th-century mosque-monument that is the enduring symbol of Hyderabad.", wiki: "https://en.wikipedia.org/wiki/Charminar" },
                { name: "Golconda Fort", note: "Massive fortress once famed as a centre of diamond trade.", wiki: "https://en.wikipedia.org/wiki/Golconda" },
                { name: "Ramappa Temple", note: "UNESCO-listed Kakatiya-era temple known for its floating bricks.", wiki: "https://en.wikipedia.org/wiki/Ramappa_Temple" }
            ]
        },
        karnataka: {
            name: "Karnataka",
            region: "Southern India",
            wiki: "https://en.wikipedia.org/wiki/Karnataka",
            blurb: "Home to the ruined splendour of Vijayanagara and the ornate temples of the Hoysalas.",
            monuments: [
                { name: "Hampi", note: "UNESCO World Heritage ruins of the once-mighty Vijayanagara Empire.", wiki: "https://en.wikipedia.org/wiki/Hampi" },
                { name: "Mysore Palace", note: "Opulent royal residence known for its illuminated domes and durbar hall.", wiki: "https://en.wikipedia.org/wiki/Mysore_Palace" },
                { name: "Belur & Halebidu", note: "Hoysala-era temples celebrated for extraordinarily detailed stone carving.", wiki: "https://en.wikipedia.org/wiki/Hoysala_architecture" }
            ]
        },
        ap: {
            name: "Andhra Pradesh",
            region: "Southern India",
            wiki: "https://en.wikipedia.org/wiki/Andhra_Pradesh",
            blurb: "A land of ancient Buddhist stupas and one of Hinduism's most visited pilgrimage hills.",
            monuments: [
                { name: "Tirumala Temple", note: "One of the world's most visited pilgrimage sites, dedicated to Lord Venkateswara.", wiki: "https://en.wikipedia.org/wiki/Tirumala_Venkateswara_Temple" },
                { name: "Amaravati Stupa", note: "Remains of an ancient Buddhist stupa complex from the Satavahana era.", wiki: "https://en.wikipedia.org/wiki/Amaravati_Stupa" },
                { name: "Lepakshi Temple", note: "16th-century temple famed for its hanging pillar and mural paintings.", wiki: "https://en.wikipedia.org/wiki/Lepakshi" }
            ]
        },
        tn: {
            name: "Tamil Nadu",
            region: "Southern India",
            wiki: "https://en.wikipedia.org/wiki/Tamil_Nadu",
            blurb: "The heartland of Dravidian temple architecture, classical dance and centuries of Chola legacy.",
            monuments: [
                { name: "Brihadisvara Temple", note: "Raja Raja Chola I's 11th-century masterpiece in Thanjavur, a UNESCO site.", wiki: "https://en.wikipedia.org/wiki/Brihadeeswarar_Temple" },
                { name: "Meenakshi Temple", note: "Vast temple complex in Madurai known for its towering, sculpted gopurams.", wiki: "https://en.wikipedia.org/wiki/Meenakshi_Amman_Temple" },
                { name: "Mahabalipuram", note: "Shore temples and rock-cut monuments from the Pallava dynasty.", wiki: "https://en.wikipedia.org/wiki/Mahabalipuram" }
            ]
        },
        kerala: {
            name: "Kerala",
            region: "Southern India",
            wiki: "https://en.wikipedia.org/wiki/Kerala",
            blurb: "God's Own Country — a coastal state shaped by spice trade, backwaters and temple traditions.",
            monuments: [
                { name: "Padmanabhaswamy Temple", note: "Historic Thiruvananthapuram temple renowned for its wealth and architecture.", wiki: "https://en.wikipedia.org/wiki/Padmanabhaswamy_Temple" },
                { name: "Bekal Fort", note: "Largest fort in Kerala, built on the coastline by the Kolathiri dynasty.", wiki: "https://en.wikipedia.org/wiki/Bekal_Fort" },
                { name: "Kerala Backwaters", note: "Traditional canal network reflecting centuries of maritime trade culture.", wiki: "https://en.wikipedia.org/wiki/Kerala_backwaters" }
            ]
        }
    };

    const mapPins = document.querySelectorAll(".map-pin");
    const mapInfoPanel = document.getElementById("mapInfoPanel");

    mapPins.forEach(pin => {
        pin.addEventListener("click", () => {
            const key = pin.getAttribute("data-state");
            const data = stateHeritageData[key];
            if (!data) return;

            mapPins.forEach(p => p.classList.remove("active"));
            pin.classList.add("active");

            const monumentsHTML = data.monuments.map(m => `
                <div class="monument-chip">
                    <h4>${m.name}</h4>
                    <p>${m.note}</p>
                    <a class="wiki-link" href="${m.wiki}" target="_blank" rel="noopener">Read on Wikipedia ↗</a>
                </div>
            `).join("");

            mapInfoPanel.style.opacity = "0";
            setTimeout(() => {
                mapInfoPanel.innerHTML = `
                    <div class="map-state-region">${data.region}</div>
                    <div class="map-state-name">${data.name}</div>
                    <p class="map-state-blurb">${data.blurb}</p>
                    <a class="wiki-link wiki-link-state" href="${data.wiki}" target="_blank" rel="noopener">About ${data.name} on Wikipedia ↗</a>
                    <div class="monument-list">${monumentsHTML}</div>
                `;
                mapInfoPanel.style.transition = "opacity 0.35s ease";
                mapInfoPanel.style.opacity = "1";
            }, 150);
        });
    });