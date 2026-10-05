document.addEventListener('DOMContentLoaded', () => {
    function showScreen(screenId) {
        document.querySelectorAll('.page-screen').forEach(scr => scr.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    function updateThemeBackground(cat) {
        document.body.className = '';
        if(cat === 'islamic') document.body.classList.add('bg-islamic');
        else if(cat === 'sports') document.body.classList.add('bg-sports');
        else if(cat === 'culture') document.body.classList.add('bg-culture');
        else if(cat === 'entertainment') document.body.classList.add('bg-entertainment');
        else document.body.classList.add('bg-welcome');
    }

    const helpBtn = document.getElementById('helpBtn');
    const helpModal = document.getElementById('helpModal');
    const closeModal = document.getElementById('closeModal');
    const engineerModal = document.getElementById('engineerModal');

    if(helpBtn) helpBtn.addEventListener('click', () => helpModal.classList.add('active'));
    if(closeModal) closeModal.addEventListener('click', () => helpModal.classList.remove('active'));

    // نظام النجوم التفاعلية الفارغة والمليئة بالضغط
    let selectedRating = 0;
    const starIcons = document.querySelectorAll('.star-rating-container i, .fa-star');
    starIcons.forEach((star, index) => {
        star.classList.remove('fas');
        star.classList.add('far');
        
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            starIcons.forEach((s, i) => {
                if (i < selectedRating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                    s.style.color = '#facc15';
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                    s.style.color = '#cbd5e1';
                }
            });
        });
    });

    // زر إرسال التقييم مع التعليق
    document.getElementById('submitRating')?.addEventListener('click', () => {
        const commentBox = document.getElementById('userCommentInput');
        const commentText = commentBox ? commentBox.value.trim() : '';
        
        if (selectedRating === 0) {
            alert('من فضلك حدد عدد النجوم أولاً يا باشمهندس!');
            return;
        }

        alert(`شكراً لتقييمك (${selectedRating} نجوم)! تم حفظ تعليقك بنجاح يا فنان.`);
        if(commentBox) commentBox.value = '';
        helpModal.classList.remove('active');
    });

    let selectedAvatar = "eng1";
    document.querySelectorAll('.avatars-grid img').forEach(img => {
        img.addEventListener('click', (e) => {
            document.querySelectorAll('.avatars-grid img').forEach(i => i.classList.remove('selected'));
            e.target.classList.add('selected');
            selectedAvatar = e.target.dataset.avatar;
        });
    });

    let pendingUserSession = null;

    document.getElementById('startJourneyBtn')?.addEventListener('click', () => {
        const nameInput = document.getElementById('playerName');
        const name = nameInput ? nameInput.value.trim() : '';
        
        if(!name) { 
            alert('من فضلك ادخل الاسم المستعار الكريم يا بشمهندس!'); 
            if(nameInput) nameInput.focus();
            return; 
        }
        
        const genderElem = document.querySelector('input[name="gender"]:checked');
        const gender = genderElem ? genderElem.value : 'male';
        
        pendingUserSession = { name, gender, avatar: selectedAvatar, score: 0 };
        engineerModal.classList.add('active');
    });

    document.getElementById('btnIsEngineer')?.addEventListener('click', () => {
        engineerModal.classList.remove('active');
        alert('أهلاً بك يا فنان، بالتوفيق في اختبارات المهندسين الصعبة!');
        finalizeLogin();
    });

    document.getElementById('btnWillTry')?.addEventListener('click', () => {
        engineerModal.classList.remove('active');
        alert('إشعار تحدي: طريق الهندسة صعب، لكن قدها يا وحش!');
        finalizeLogin();
    });

    function finalizeLogin() {
        if(!pendingUserSession) return;
        localStorage.setItem('currentUser', JSON.stringify(pendingUserSession));
        setupUserSession();
        updateThemeBackground('');
        showScreen('screenCategories');
    }

    function setupUserSession() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if(!user) return;
        const nameDisplay = document.getElementById('nameCatScreen');
        if(nameDisplay) nameDisplay.innerText = (user.gender === 'female' ? 'البشمهندسة: ' : 'البشمهندس: ') + user.name;
        
        const avatarDisplay = document.getElementById('avatarCatScreen');
        if(avatarDisplay) avatarDisplay.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${user.avatar}`;
        
        const scoreDisplay = document.getElementById('userScoreDisplay');
        if(scoreDisplay) scoreDisplay.innerText = user.score || 0;
    }

    if(localStorage.getItem('currentUser')) {
        setupUserSession();
        showScreen('screenCategories');
    }

    document.getElementById('logoutBtn1')?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        updateThemeBackground('');
        showScreen('screenWelcome');
    });

    let currentCat = '';
    let currentBookId = 1;
    let currentQuestionIndex = 0;

    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            currentCat = card.dataset.cat;
            updateThemeBackground(currentCat);
            renderBooks(currentCat);
            showScreen('screenLibrary');
        });
    });

    document.getElementById('backToCategories')?.addEventListener('click', () => {
        updateThemeBackground('');
        showScreen('screenCategories');
    });

    function renderBooks(cat) {
        const container = document.getElementById('booksContainer');
        if(!container) return;
        container.innerHTML = '';
        
        const bookIcons = [
            { icon: "fa-microchip", title: "الكتاب الأول: الأساسيات" },
            { icon: "fa-cogs", title: "الكتاب الثاني: الاحتراف" },
            { icon: "fa-network-wired", title: "الكتاب الثالث: المعمارية" }
        ];

        for(let i = 1; i <= 3; i++) {
            let isCompleted = localStorage.getItem(`progress_${cat}_book_${i}`) === 'completed';
            let isLocked = i > 1 && localStorage.getItem(`progress_${cat}_book_${i-1}`) !== 'completed';
            let bInfo = bookIcons[i-1];

            container.innerHTML += `
                <div class="book-icon-card ${isLocked ? 'locked' : ''}" data-cat="${cat}" data-book="${i}">
                    <i class="fa-solid ${bInfo.icon}" style="font-size: 38px; color: var(--accent);"></i>
                    <h4 style="font-size: 16px; margin-top: 5px;">${bInfo.title}</h4>
                    <span style="font-size: 13px; color: var(--text-muted);">${isCompleted ? 'مكتمل (اضغط لإعادة الاختبار) ✅' : '100 سؤال حقيقي'}</span>
                </div>
            `;
        }

        document.querySelectorAll('.book-icon-card').forEach(card => {
            card.addEventListener('click', () => {
                if(card.classList.contains('locked')) {
                    alert('هذا الكتاب مغلق! أنهِ الكتاب السابق أولاً يا مهندس.');
                    return;
                }
                currentBookId = parseInt(card.dataset.book);
                
                if(localStorage.getItem(`progress_${cat}_book_${currentBookId}`) === 'completed') {
                    if(confirm('أنت أتممت هذا الكتاب مسبقاً! هل تريد إعادة الاختبار من البداية؟')) {
                        localStorage.removeItem(`q_idx_${cat}_${currentBookId}`);
                        localStorage.removeItem(`progress_${cat}_book_${currentBookId}`);
                    }
                }

                currentQuestionIndex = parseInt(localStorage.getItem(`q_idx_${cat}_${currentBookId}`)) || 0;
                loadQuestion();
                showScreen('screenQuiz');
            });
        });
    }

    document.getElementById('backToLibrary')?.addEventListener('click', () => {
        updateThemeBackground(currentCat);
        renderBooks(currentCat);
        showScreen('screenLibrary');
    });

    function getArabicQuestion(cat, qIndex) {
        // التأكد من وجود كائن الأسئلة العام أو جلب المصفوفة المناسبة للقسم
        let list = [];
        if (typeof masterBanks !== 'undefined') {
            if (masterBanks[cat]) {
                list = masterBanks[cat];
            } else {
                // محاولة البحث عن أي مفتاح متاح في masterBanks لو اسم القسم مختلف قليلاً
                const keys = Object.keys(masterBanks);
                if (keys.length > 0) list = masterBanks[keys[0]];
            }
        }
        
        if (!list || list.length === 0) {
            return { q: "عذراً، لم يتم العثور على أسئلة لهذا القسم بعد.", correct: "خطأ", options: ["خطأ", "خطأ", "خطأ", "خطأ"] };
        }

        let baseObj = list[qIndex % list.length];
        let multiplier = Math.floor(qIndex / list.length);

        if (multiplier > 0) {
            return {
                q: `${baseObj.q} (المستوى الهندسي ${currentBookId} - تمرين ${qIndex + 1})`,
                options: [...baseObj.options].reverse(),
                correct: baseObj.correct
            };
        }
        return baseObj;
    }

    function loadQuestion() {
        if(currentQuestionIndex >= 100) {
            localStorage.setItem(`progress_${currentCat}_book_${currentBookId}`, 'completed');
            alert('تهانينا الهندسية! أتممت الكتاب بنجاح وتم فتح الكتاب التالي.');
            renderBooks(currentCat);
            showScreen('screenLibrary');
            return;
        }

        const numElem = document.getElementById('currentQuestionNum');
        if(numElem) numElem.innerText = currentQuestionIndex + 1;

        let currentQObj = getArabicQuestion(currentCat, currentQuestionIndex);

        const textElem = document.getElementById('questionText');
        if(textElem) textElem.innerText = currentQObj.q;

        const correctOption = currentQObj.correct;
        const shuffled = [...currentQObj.options].sort(() => Math.random() - 0.5);

        const optionsContainer = document.getElementById('optionsContainer');
        if(optionsContainer) {
            optionsContainer.innerHTML = shuffled.map(opt => `
                <button class="option-btn" data-val="${opt}">${opt}</button>
            `).join('');
        }

        const nextBtn = document.getElementById('nextQuestionBtn');
        if(nextBtn) nextBtn.classList.add('hidden');

        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selected = e.target.dataset.val;
                document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
                
                let user = JSON.parse(localStorage.getItem('currentUser')) || { score: 0 };

                if(selected === correctOption) {
                    e.target.style.background = '#22c55e';
                    e.target.style.color = '#fff';
                    user.score += (currentBookId * 30) + 15;
                } else {
                    e.target.style.background = '#ef4444';
                    e.target.style.color = '#fff';
                    user.score = Math.max(0, user.score - 10);
                    document.querySelectorAll('.option-btn').forEach(b => {
                        if(b.dataset.val === correctOption) {
                            b.style.background = '#22c55e';
                            b.style.color = '#fff';
                        }
                    });
                }

                localStorage.setItem('currentUser', JSON.stringify(user));
                const scoreDisp = document.getElementById('userScoreDisplay');
                if(scoreDisp) scoreDisp.innerText = user.score;

                if(nextBtn) nextBtn.classList.remove('hidden');
            });
        });
    }

    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) {
        nextBtn.replaceWith(nextBtn.cloneNode(true));
        document.getElementById('nextQuestionBtn').addEventListener('click', () => {
            currentQuestionIndex++;
            localStorage.setItem(`q_idx_${currentCat}_${currentBookId}`, currentQuestionIndex);
            loadQuestion();
        });
    }
});