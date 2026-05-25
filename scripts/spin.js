function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

const discord_id = getCookie("discord_id");

async function spinWheel() {
  if (!discord_id) {
    alert("Please log in with Discord first.");
    return;
  }

  const res = await fetch("/api/spin", {
    method: "POST",
    headers: {
      "x-discord-id": discord_id
    }
  });

  const data = await res.json();

  if (data.error) {
    alert(data.error);
    return;
  }

  alert("You won: " + data.reward);
}
