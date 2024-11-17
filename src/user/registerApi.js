export function registerUser(user, onSuccess, onError) {
    fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
    .then(async (response) => {
      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        onError(error);
      }
    })
    .catch((error) => {
      console.error("Erreur de connexion à l'API :", error);
      onError(error);
    });
}