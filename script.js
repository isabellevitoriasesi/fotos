const video = document.getElementById("camera");
const button = document.getElementById("capturar");
const buttonPB = document.getElementById("capturarPB");
const buttonAtivar = document.getElementById("ativar");
const buttonDesativar = document.getElementById("desativar");
const buttonExcluir = document.getElementById("excluir");
const canva = document.getElementById("foto");
const albumDiv = document.getElementById("fotos");

let cameraStream = null;  

async function startCamera() {
    try {
        if (cameraStream) {
            return;
        }
        const dados = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraStream = dados;
        video.srcObject = dados;
    } catch (erro) {
        alert('Erro ao abrir câmera');
    }
}

function stopCamera() {
    if (cameraStream) {
        const tracks = cameraStream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
        cameraStream = null;
    }
}

function addPhotoToAlbum(photoDataUrl) {
    const photoContainer = document.createElement('div');
    photoContainer.classList.add('photo-container');
    
    const photo = document.createElement('img');
    photo.src = photoDataUrl;
    photo.classList.add('photo-thumbnail');
    
    photoContainer.appendChild(photo);
    albumDiv.appendChild(photoContainer);
}

button.addEventListener('click', function () {
    const contexto = canva.getContext('2d');
    canva.width = video.videoWidth;
    canva.height = video.videoHeight;
    contexto.drawImage(video, 0, 0, canva.width, canva.height);
    canva.style.display = 'block';

    // Adiciona a foto ao álbum
    const photoDataUrl = canva.toDataURL();
    addPhotoToAlbum(photoDataUrl);
});

buttonPB.addEventListener('click', function () {
    const contexto = canva.getContext('2d');
    canva.width = video.videoWidth;
    canva.height = video.videoHeight;
    contexto.drawImage(video, 0, 0, canva.width, canva.height);

 
     /* PB*/
    const imageData = contexto.getImageData(0, 0, canva.width, canva.height);
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        const gray = 0.3 * r + 0.59 * g + 0.11 * b;

        pixels[i] = gray;
        pixels[i + 1] = gray;
        pixels[i + 2] = gray;
    }

    contexto.putImageData(imageData, 0, 0);
    canva.style.display = 'block';

    
     /* Foto no album */
    
    const photoDataUrl = canva.toDataURL();
    addPhotoToAlbum(photoDataUrl);
});

buttonAtivar.addEventListener('click', function () {
    startCamera();
});

buttonDesativar.addEventListener('click', function () {
    stopCamera();
});

/* Remove a última foto */

buttonExcluir.addEventListener('click', function () {
    const photos = albumDiv.querySelectorAll('.photo-container');
    if (photos.length > 0) {
        photos[photos.length - 1].remove();  
    }
});


startCamera();

