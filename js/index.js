/***************************************************************************************/
// Name Space

// JSEncrypt -> Crypto Functions
const crypt = new JSEncrypt();

/***************************************************************************************/
// Elements

// Get URL
const urlParams = new URLSearchParams(window.location.search);

// URL Params to insert the encrypted password with RSA cryptosystem
const encryptedData = urlParams.get('secret');

// Get button with ID GenerateLinkButton
const generateLinkButton = document.getElementById('GenerateLinkButton');

// Get button with ID revealSecretButton
const revealSecretButton = document.getElementById('revealSecretButton');

/***************************************************************************************/
// Generate Link Logic

// check private/public key uploaded
// return true if uploaded false if not
function uploadedKey(fileInputId) {
    const fileInput = document.getElementById(fileInputId);
    const file = fileInput.files[0];

    if (!file) {
        return false
    }

    return true
}

// function to encrypt the text
function encrypt(pubKey){
    const secret = document.getElementById('Secret').value;

    if (!pubKey || !secret) return showToast(false, 'Failed', 'Can not generate secure link! Write the secret or upload the pub key');

    crypt.setPublicKey(pubKey);
    const encrypted = crypt.encrypt(secret);

    if (!encrypted) {
        return showToast(false, 'Failed', 'Can not generate secure link! Invalid public key');
    } else {
        showToast(true, 'Success', 'Secure link generated successfully!')
    }

    const link = `${window.location.origin}${window.location.pathname}?secret=${encodeURIComponent(encrypted)}`;

    const resultBox = document.getElementById('SecureLink');
    resultBox.href = link
    resultBox.textContent = link;

    const SecureLinkForm = document.getElementById('GeneratedLinkForm')
    SecureLinkForm.classList.remove('hidden')
}

// Generate Secure link
async function generateSecureLink(fileInputId) {
    // first check if file was uploaded
    const loadedFileCheckResult = uploadedKey(fileInputId);

    if (!loadedFileCheckResult){
        showToast(false, 'Failed', 'Can not generate secure link! Please add the Public Key');
    } else {

        // Read the file content
        const fileInput = document.getElementById(fileInputId);
        const file = fileInput.files[0];
        const pubKey = await file.text();

        encrypt(pubKey);
    }
}

// Function when click Generate Secure Link
generateLinkButton.addEventListener('click', async () => generateSecureLink('file_input'));

/***************************************************************************************/
// Copy secure link
const copySecureLink = document.getElementById('copySecureLink')

function copySecureLinkFunction() {
    const linkText = document.getElementById('SecureLink').textContent;
    navigator.clipboard.writeText(linkText).then(() => {
        showToast(true, 'Success', 'Link copied!')
    });
}

// Function when click copySecureLink
copySecureLink.addEventListener('click', () => copySecureLinkFunction('file_input'));

/***************************************************************************************/
// send email button
const mailbtn = document.getElementById('mailto-btn')

// Send link by email
function sendSecureLinkbyEmail() {
    const link = document.getElementById('SecureLink').textContent;
    const email = document.getElementById('sendSecureLink').value;
    const subject = "Te he enviado una credencial cifrada";
    const body = `Hola,\n\nTe envío una credencial segura. Necesitarás tu llave privada.\n\nAccede aquí:\n${link}\n\n`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.getElementById('mailto-btn').setAttribute('href', mailtoLink);
}

// Function when click sendSecureLinkbyEmail
mailbtn.addEventListener('click', () => sendSecureLinkbyEmail());

/***************************************************************************************/
// Reveal Secret Logic
if (encryptedData) {
    document.getElementById('SecureForm').classList.add('hidden');
    document.getElementById('DecryptionForm').classList.remove('hidden');
    document.getElementById('titleEncDecCard').textContent = "decryption_mode: active";
}

// function to decrypt the text
function decrypt(privKey) {
    if (!privKey) return showToast(false, 'Failed', 'Can not revel secret! Please add the Private Key');

    try {
        crypt.setPrivateKey(privKey);
        const decrypted = crypt.decrypt(decodeURIComponent(encryptedData));

        if (decrypted) {
            document.getElementById('RevealSecretPreForm').classList.add('hidden');
            document.getElementById('revealed_secret').textContent = decrypted;
            document.getElementById('SecretRevealedForm').classList.remove('hidden');
        } else {
            showToast(false, 'Failed', 'Can not revel secret! Please add the correct Private Key');
        }
    } catch (e) {
        showToast(false, 'Failed', 'Can not revel secret! Failed to decrypt Secret');
    }
}

// Reveal Secret
async function revealSecret(fileInputId) {
    // first check if file was uploaded
    const loadedFileCheckResult = uploadedKey(fileInputId);

    if (!loadedFileCheckResult) {
        showToast(false, 'Failed', 'Can not generate secure link! Please add the Private Key');
    } else {

        // Read the file content
        const fileInput = document.getElementById(fileInputId);
        const file = fileInput.files[0];
        const privKey = await file.text();

        const cypherText = decrypt(privKey);

        showToast(true, 'Success', 'Secret Revealed!')

    }
}

// Function when click Reveal Secret
revealSecretButton.addEventListener('click', async () => revealSecret('private_key'));