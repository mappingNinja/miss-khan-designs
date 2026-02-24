/* Contact Form Submission Script */

const ENDPOINT = 'https://business-email-sender.vercel.app/email/miss-khan';
const form = document.getElementById('miss-khan-contact-form');

if (form) {
  const getSelectText = (id) => {
    const select = document.getElementById(id);
    return select?.options?.[select.selectedIndex]?.text || '';
  };

  const getFormValue = (formData, field) => (formData.get(field) || '').toString().trim();

  const handleFormSubmmit = async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn?.setAttribute('disabled', 'true');

    const formData = new FormData(form);

    const payload = {
      name: getFormValue(formData, 'name'),
      email: getFormValue(formData, 'email'),
      phone: getFormValue(formData, 'phone'),
      serviceType: getSelectText('service'),
      subject: getFormValue(formData, 'subject'),
      message: getFormValue(formData, 'message'),
      budget: getSelectText('budget') || getFormValue(formData, 'budget')
    };

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to send inquiry');
      }

      alert('Thank you! Your inquiry has been sent successfully.');
      form.reset();

    } catch (error) {
      alert(error.message || 'Something went wrong. Please try again.');

    } finally {
      submitBtn?.removeAttribute('disabled');
    }
  }

  form.addEventListener('submit', handleFormSubmmit);
}