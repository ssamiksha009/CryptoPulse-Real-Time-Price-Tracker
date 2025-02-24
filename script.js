document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("cryptoTable");
    const currencySelect = document.getElementById("currency");
    const searchInput = document.getElementById("search");
    const toggleModeBtn = document.getElementById("toggleMode");
    const cryptoChart = document.getElementById("cryptoChart").getContext("2d");

    let currency = "usd";
    let cryptoData = [];
    let chart;

    const fetchCryptoData = async () => {
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=10&page=1&sparkline=true`;
        const response = await fetch(url);
        cryptoData = await response.json();
        displayCrypto();
        updateChart();
    };

    const displayCrypto = () => {
        tableBody.innerHTML = "";
        cryptoData.forEach((coin, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${coin.name} (${coin.symbol.toUpperCase()})</td>
                    <td>${currency.toUpperCase()} ${coin.current_price.toFixed(2)}</td>
                    <td style="color:${coin.price_change_percentage_24h >= 0 ? 'green' : 'red'};">
                        ${coin.price_change_percentage_24h.toFixed(2)}%
                    </td>
                    <td>${currency.toUpperCase()} ${coin.market_cap.toLocaleString()}</td>
                    <td class="favorite">⭐</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    };

    const updateChart = () => {
        if (chart) chart.destroy();
        const labels = cryptoData.map(coin => coin.name);
        const prices = cryptoData.map(coin => coin.current_price);
        chart = new Chart(cryptoChart, {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Price Trends",
                    data: prices,
                    borderColor: "cyan",
                    fill: false
                }]
            }
        });
    };

    currencySelect.addEventListener("change", (e) => {
        currency = e.target.value;
        fetchCryptoData();
    });

    toggleModeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    fetchCryptoData();
    setInterval(fetchCryptoData, 30000);
});
