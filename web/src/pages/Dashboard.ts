export default function renderDashboard() {
  const username = localStorage.getItem('username');
  
  return `
  <div class="flex flex-col h-full space-y-10 w-full justify-center items-center  text-center text-secondary text-4xl font-secondary p-10">
    <h1 class="text-6xl font-bold mb-4">Dashboard</h1>
    <p>Bienvenue <span class="font-bold">${username ? username : 'Utilisateur'}</span> sur votre tableau de bord !</p>
    <p>Contenu du dashboard à venir...</p>
  </div>`;
}