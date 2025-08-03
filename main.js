var typed = new Typed(".text", {
    strings: ["Frontend Developer"],
    typeSpeed: 100,
    backSpeed: 60,
    backDelay: 1000,
    loop: true
});

const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.navbar');

hamburger.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.querySelectorAll('.navbar a').forEach(navLink => {
            navLink.classList.remove('active');
        });
        link.classList.add('active');
        if (window.innerWidth <= 768) {
            navbar.classList.remove('active');
        }
    });
});

document.querySelectorAll('.portfolio-content .row').forEach(row => {
    row.addEventListener('mouseenter', () => {
        row.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        row.style.transform = 'translateY(-5px) scale(1.02)';
        row.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
    });
    row.addEventListener('mouseleave', () => {
        row.style.transform = 'translateY(0) scale(1)';
        row.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form form');
    const submitButton = document.querySelector('.contact-form .send');
    const formMessage = document.querySelector('#formMessage');

    if (!contactForm || !submitButton || !formMessage) {
        console.error('Contact form, submit button, or form message element not found');
        return;
    }

    let isSubmitting = false;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        isSubmitting = true;
        submitButton.disabled = true;
        submitButton.value = 'Sending...';
        submitButton.style.opacity = '0.7';
        formMessage.textContent = 'Submitting your message...';
        formMessage.className = 'form-message';
        formMessage.style.display = 'block';

        const formData = new FormData(contactForm);
        let attempt = 0;
        const maxRetries = 2;

        async function sendForm() {
            let response = null; // Declare response outside try block
            try {
                response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formMessage.textContent = 'Message sent successfully! I’ll get back to you soon.';
                    formMessage.className = 'form-message success';
                    contactForm.reset();
                } else {
                    const result = await response.json();
                    throw new Error(result.error || 'Failed to send message.');
                }
            } catch (error) {
                attempt++;
                console.error(`Attempt ${attempt} failed: ${error.message}`);
                if (attempt <= maxRetries) {
                    formMessage.textContent = `Retrying (${attempt}/${maxRetries})...`;
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return sendForm();
                } else {
                    formMessage.textContent = `Error: ${error.message} Please check your internet connection or try again later.`;
                    formMessage.className = 'form-message error';
                }
            } finally {
                if (attempt > maxRetries || response?.ok) {
                    isSubmitting = false;
                    submitButton.disabled = false;
                    submitButton.value = 'Submit';
                    submitButton.style.opacity = '1';
                }
            }
        }

        await sendForm();
    });
});

const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.id === 'skills') {
            entry.target.classList.add('active');
            const progressBars = entry.target.querySelectorAll('.Progress-line span');
            progressBars.forEach(bar => {
                bar.style.transition = 'none';
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.transition = 'width 1.5s ease-in-out';
                    bar.style.width = bar.parentElement.classList.contains('html') ? '90%' :
                                    bar.parentElement.classList.contains('css') ? '80%' :
                                    bar.parentElement.classList.contains('python') ? '85%' :
                                    bar.parentElement.classList.contains('django') ? '60%' :
                                    bar.parentElement.classList.contains('git') ? '60%' :
                                    bar.parentElement.classList.contains('figma') ? '50%' : '0';
                }, 50);
            });
        }
    });
}, { threshold: 0.1, rootMargin: '0px' });

sections.forEach(section => {
    observer.observe(section);
});