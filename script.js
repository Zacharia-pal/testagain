// Language data
const languages = {
    en: {
        homeTitle: "Welcome to Our IT Solutions Business",
        homeDescription: "Innovative IT solutions tailored to your needs. Let’s solve your challenges together!",
        buttonText: "Get in Touch",
        // Add other page content here
    },
    nl: {
        homeTitle: "Welkom bij Ons IT Oplossingsbedrijf",
        homeDescription: "Innovatieve IT-oplossingen op maat van uw behoeften. Laten we samen uw uitdagingen oplossen!",
        buttonText: "Neem contact op",
        // Add other page content here
    },
    fr: {
        homeTitle: "Bienvenue dans notre entreprise de solutions informatiques",
        homeDescription: "Des solutions informatiques innovantes adaptées à vos besoins. Résolvons vos défis ensemble !",
        buttonText: "Contactez-nous",
        // Add other page content here
    }
};

// Function to get the selected language from the URL
function getLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang');
    return lang && languages[lang] ? lang : 'en'; // Default to 'en'
}

// Function to change the content based on the language
function changeLanguage() {
    const lang = getLanguage();
    const languageContent = languages[lang];

    // Update page content based on the selected language
    document.getElementById('home-title').textContent = languageContent.homeTitle;
    document.getElementById('home-description').textContent = languageContent.homeDescription;
    document.querySelector('button').textContent = languageContent.buttonText;

    // Optionally, you can also update other elements on each page here
}

// Initialize the language change on page load
window.onload = changeLanguage;


// // later additions
//     const toggleButton = document.querySelector('.navbar-toggle');
//     const sidebar = document.querySelector('.sidebar');
//     const header = document.querySelector('header');
//     const content = document.querySelector('.content');

//     toggleButton.addEventListener('click', () => {
//         sidebar.classList.toggle('active');  // Toggle sidebar visibility
//         header.classList.toggle('shifted');  // Add 'shifted' class to header
//         content.classList.toggle('shifted');  // Add 'shifted' class to content
//     });
