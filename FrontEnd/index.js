
 /* Fonction asynchrone qui effectue une requête HTTP pour récupérer des données depuis l'API */

 /* Récupération des travaux */
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  /* Passe la réponse en tant que JSON et la retourne */
  return await response.json();
}
getWorks();

/* Fonction asynchrone permettant d'afficher les œuvres */

const gallery = document.querySelector(".gallery");
/* Affichage des travaux */
async function displayWorks() {
  const works = await getWorks();
  /* supprimez du html les travaux déja existant */
  gallery.innerHTML = "";
 /* Pour chaque œuvre dans le tableau, appelle la fonction createWorks */
  works.forEach((work) => {
    createWorks(work);
  });
}
displayWorks();

 /* Fonction permettant de créer des éléments DOM associés à une œuvre */
function createWorks(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  img.src = work.imageUrl;
  figcaption.textContent = work.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);

}
 /* Récupération des catégories du tableau */

const filters = document.querySelector(".filters")
 /* Effectue une requête HTTP vers l'API pour obtenir les catégories */
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}
getCategories();

/* Affichage des catégories du tableau */
async function displayCategoryButtons() {
   /* Appel la fonction getCategories pour obtenir les catégories depuis l'API */
  const categories = await getCategories();
  /* Pour chaque catégorie obtenue, on crée un bouton */
  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.id = category.id;
    filters.appendChild(btn);
  });
}
/* Appel la fonction displayCategoryButtons pour afficher les boutons des catégories dans le DOM */
displayCategoryButtons();

/* Filtrage des boutons de catégories */

async function filterCategory() {
  const images = await getWorks();
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
       /* Récupération de l'ID du bouton cliqué */
      const btnId = e.target.id;
      gallery.innerHTML = "";
      if (btnId !== "0") {
        const triImages = images.filter((work) => {
          return work.categoryId == btnId;
        });
        triImages.forEach((work) => {
          createWorks(work);
        })
      } else {
        displayWorks();
      }
    });
  });
}
filterCategory();


/* Modale 1 */

const loged = window.sessionStorage.loged
const logout = document.querySelector("header nav .logout");
const modifier = document.querySelector(".modifier ");
const containerModals = document.querySelector(".container-modals");
const closeModals = document.querySelector(".container-modals .fa-xmark");
const projetModal = document.querySelector(".projet-modal");
const admin = document.querySelector(".admin");

/* Si l'utilisateur est connecté */

if (loged == "true") {
  admin.style.display = "flex";
  logout.textContent = "logout";
  modifier.style.display = "flex";
  logout.addEventListener("click", () => {
    window.sessionStorage.loged = false;
  });
}
/* Au click sur modifier affichage de la modale */
modifier.addEventListener("click", () => {
  containerModals.style.display = "flex";
});

closeModals.addEventListener("click", () => {
  containerModals.style.display = "none";
});

containerModals.addEventListener("click", (e) => {
  if (e.target.className == "container-modals") {
    containerModals.style.display = "none";
  }
});

/* Affichage et gestion de la galerie d'images dans la modale 1 */

async function displayGalleryModal() {
  projetModal.innerHTML = "";
  const projetWork = await getWorks();
  projetWork.forEach(projet => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const span = document.createElement("span");
    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can");
    trash.id = projet.id;
    trash.addEventListener("click", () => {
  /* Récupèration du token d'authentification depuis la sessionStorage */
      const token = window.sessionStorage.getItem("token");
      /* Envoie une requête DELETE au serveur pour supprimer le projet */
      fetch(`http://localhost:5678/api/works/${projet.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(data => {
          figure.remove();
displayWorks();
        })
    })
img.src = projet.imageUrl;
    span.appendChild(trash);
    figure.appendChild(span);
    figure.appendChild(img);
    projetModal.appendChild(figure);
  });
}
displayGalleryModal();

/* Modale 2 */

const btn1 = document.querySelector(".button-modal-1");
const modalAjoutPhoto = document.querySelector(".modal-ajout");
const modalGaleriePhoto = document.querySelector(".modal-projet");
const arrowLeft = document.querySelector(".fa-arrow-left");
const closeModal2 = document.querySelector(".modal-ajout .fa-xmark");
 /* Fonction permettant l'affichage de la modale 2 */
function displayModal2() {
  btn1.addEventListener("click", () => {
    modalAjoutPhoto.style.display = "flex";
    modalGaleriePhoto.style.display = "none";
  });
  arrowLeft.addEventListener("click", () => {
    modalAjoutPhoto.style.display = "none";
    modalGaleriePhoto.style.display = "flex";
  });

  closeModal2.addEventListener("click", () => {
    containerModals.style.display = "none";
  });
}
displayModal2();

/* Prévisualisation de l'image */

const previewImg = document.querySelector(".container-file img");
const inputFile = document.querySelector(".container-file input");
const labelFile = document.querySelector(".container-file label");
const iconFile = document.querySelector(".container-file .fa-image");
const pFile = document.querySelector(".container-file p");

inputFile.addEventListener("change", () => {
   /* Récupération du fichier sélectionné dans l'input */
  const file = inputFile.files[0]

  if (file) {
    /* Création d'un objet FileReader pour lire le contenu du fichier */
    const reader = new FileReader();
    /* Fonction exécutée lorsque la lecture du fichier est terminée */
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      previewImg.style.display = "flex";
      labelFile.style.display = "none";
      iconFile.style.display = "none";
      pFile.style.display = "none";
    }
      /* Lecture du contenu du fichier sous forme d'URL data:URL */
    reader.readAsDataURL(file);
  }
});

/* Création d'une liste de categories dans l'input select */

async function displayCategoryModal() {
  const select = document.querySelector(".modal-ajout select");
  const categories = await getCategories();
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name
    select.appendChild(option);
  })
}
displayCategoryModal();

/* Ajout d'une image */

const form = document.querySelector(".modal-ajout form");
const title = document.querySelector(".modal-ajout #title");
const category = document.querySelector(".modal-ajout #category-input");

form.addEventListener("submit", async (e) => {
   /* Empêche le comportement par défaut de soumission du formulaire */
  e.preventDefault();
 /* Ajout des données au FormData pour l'envoi via la requête HTTP */
  const formData = new FormData();
  formData.append("title", title.value);
  formData.append("category", category.value);
  formData.append("image", inputFile.files[0]);

  const token = window.sessionStorage.getItem("token");
 /* Envoi de la requête POST au serveur avec les données du formulaire */
  const response = await fetch("http://localhost:5678/api/works/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData,
  });

  const data = await response.json();
  displayWorks();
  displayGalleryModal();
});


/* Fonction qui verifie si les champs du formulaire sont remplis */

function formCompleted() {
  const buttonValidForm = document.querySelector(".modal-ajout button");
  title.addEventListener("change", formCompleted);
  category.addEventListener("change", formCompleted);
  inputFile.addEventListener("change", formCompleted);

  if (title.value !== "" && inputFile.files[0] !== undefined && category.value !== "") {

    buttonValidForm.classList.remove("button-modal-2");
    buttonValidForm.classList.add("button-modal-2-active");

    buttonValidForm.addEventListener("click", () => {
      modalGaleriePhoto.style.display = "flex";
      modalAjoutPhoto.style.display = "none";
      containerModals.style.display = "none";
      setTimeout(function () {
        location.reload();
      }, 500);
    });

  } else {
    buttonValidForm.classList.remove("button-modal-2-active");
    buttonValidForm.classList.add("button-modal-2");
  }
}
formCompleted();


