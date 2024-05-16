

//  l’appel à l’API avec fetch pour recuperer les données du backend 

// fonction pour recupérer le tableau des works

async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();

}
getWorks();




// affichage des travaux de l’architecte 

const gallery = document.querySelector(".gallery");

async function affichageWorks() {
  const works = await getWorks();

 // supprimez du html les travaux déja existant 

 gallery.innerHTML = "";
 

 works.forEach((work) => {
  createWorks(work);
});

}
affichageWorks();


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



// affichage des boutons par categories

// récupérer les categories et les afficher 

const filters = document.querySelector(".filters")

async function getCategorys() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
 }
 getCategorys();


 async function CategorysButtons() {
  const categorys = await getCategorys();
  categorys.forEach((category) => {
      const btn = document.createElement("button");
      btn.textContent = category.name;
      btn.id = category.id;
      filters.appendChild(btn);
  });
}
CategorysButtons();

// filtrer au click sur le bouton par catégorie

async function filterCategory() {
  const images = await getWorks();
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const btnId = e.target.id;
        gallery.innerHTML = "";
          if (btnId !== "0") {
            const triImages = images.filter((work) => {
              return work.categoryId == btnId;
             });
             triImages.forEach((work) => {
                createWorks(work);
             })
        }else {
          affichageWorks();
        }
      });
  });
}

filterCategory();



  






