

//  l’appel à l’API avec fetch

async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const responseJson = await response.json();
}
getWorks();




// ajouter à la galerie les travaux de l’architecte 

const gallery = document.querySelector(".gallery");

async function affichageWorks() {
  const works = await getWorks();
  // supprimez du html les travaus déja existant 

  gallery.innerHTML = "";
}
affichageWorks();













