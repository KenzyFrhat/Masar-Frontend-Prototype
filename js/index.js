// Start Path Function (مثال)
        function startPath() {
            //alert("سيتم توجيهك إلى صفحة إنشاء المسار التعليمي...");
            // في التطبيق الفعلي: window.location.href = "/onboarding";
            window.location.href = "onboarding.html";
        }
        
        function scrollToProblems() {
            document.getElementById('problems').scrollIntoView({ behavior: 'smooth' });
        }
        
        // تأثيرات تفاعلية بسيطة
        document.querySelectorAll('.problem-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.boxShadow = '0 15px 30px rgba(67, 97, 238, 0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
            });
        });