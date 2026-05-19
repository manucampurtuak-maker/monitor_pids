/* ==========================
   STORAGE DATA ANTRIAN
========================== */
function getData() {
    return JSON.parse(localStorage.getItem("antrianData")) || [];
}

function saveData(data) {
    localStorage.setItem("antrianData", JSON.stringify(data));
}

/* ==========================
   COUNTER NOMOR ANTRIAN
========================== */
function getCounter() {
    return parseInt(localStorage.getItem("antrianCounter")) || 1;
}

function setCounter(val) {
    localStorage.setItem("antrianCounter", val);
}

/* ==========================
   STORAGE LAST PANGGILAN
========================== */
function setLastPanggilan(data) {
    localStorage.setItem("lastPanggilan", JSON.stringify(data));
}

function getLastPanggilan() {
    return JSON.parse(localStorage.getItem("lastPanggilan"));
}

/* ==========================
   CONTROL PAGE
========================== */
function showNextNumber() {
    const el = document.getElementById("noAntrian");
    if (el) {
        el.innerText = getCounter();
    }
}

function tambahAntrian() {
    const noSI = document.getElementById("noSI").value.trim();
    const gate = document.getElementById("gate").value.trim();

    if (!noSI || !gate) {
        alert("Nomor SI dan Gate wajib diisi");
        return;
    }

    const data = getData();
    const noAntrian = getCounter();

    const item = {
        no: noAntrian,
        si: noSI,
        gate: gate,
        status: "Dipanggil",
        waktu: new Date().toLocaleString(),
        created: new Date().toISOString()
    };

    data.push(item);
    saveData(data);

    setLastPanggilan(item);

    suaraLengkap(noAntrian, noSI, gate);

    setCounter(noAntrian + 1);

    document.getElementById("noSI").value = "";
    document.getElementById("gate").value = "";

    showNextNumber();

    renderChart();
}

/* ==========================
   ULANGI PANGGILAN
========================== */
function ulangPanggilan() {
    const last = getLastPanggilan();
    if (!last) {
        alert("Belum ada panggilan");
        return;
    }
    suaraLengkap(last.no, last.si, last.gate);
}

/* ==========================
   RESET NOMOR ANTRIAN
========================== */
function resetAntrian() {
    const yakin = confirm("Reset nomor antrian ke 1? Riwayat tetap tersimpan.");
    if (!yakin) return;

    setCounter(1);
    showNextNumber();

    alert("Nomor antrian berhasil di-reset");
}

/* ==========================
   MONITOR PAGE
========================== */
function renderMonitor() {
    const data = getData();
    const container = document.getElementById("monitorList");
    if (!container) return;

    container.innerHTML = "";

    if (data.length === 0) {
        container.innerHTML = "<h2>Belum ada antrian</h2>";
        return;
    }

    const item = data[data.length - 1];
    const lastShown = JSON.parse(localStorage.getItem("lastShownMonitor"));

    container.innerHTML = `
        <div class="monitor-row">
            <div class="monitor-box">
                <div class="monitor-label">No Urut</div>
                <div class="monitor-value monitor-no">${item.no}</div>
            </div>

            <div class="monitor-box">
                <div class="monitor-label">No SI</div>
                <div class="monitor-value">${item.si}</div>
            </div>

            <div class="monitor-box">
                <div class="monitor-label">Gate</div>
                <div class="monitor-value">${item.gate}</div>
            </div>

            <div class="monitor-box status-dipanggil">
                <div class="monitor-label">Status</div>
                <div class="monitor-value">${item.status}</div>
            </div>
        </div>
    `;
}

/* ==========================
   RIWAYAT PAGE
========================== */
function renderRiwayat() {
    const data = getData();
    const tbody = document.getElementById("riwayatList");
    if (!tbody) return;

    tbody.innerHTML = "";

    data.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.no}</td>
            <td>${item.si}</td>
            <td>${item.gate}</td>
            <td>${item.status}</td>
            <td>${item.waktu}</td>
        `;
        tbody.appendChild(tr);
    });
}

/* ==========================
   SUARA
========================== */
// AUDIO BEL
const belAwal = new Audio("Bell Call Awal.wav");
const belAkhir = new Audio("Bell Call Akhir.wav");

let isSpeaking = false;

function suaraLengkap(no, si, gate) {
    if (!window.speechSynthesis) return;
    if (isSpeaking) return;

    isSpeaking = true;

   
    belAwal.pause();
    belAwal.currentTime = 0;
    belAwal.play();

    
    setTimeout(() => {
        const text =
            `Perhatian Perhatian, nomor Urut ${no}, ` +
            `dengan nomor Shipping instruction ${si}, ` +
            `silakan menuju gate ${gate}`;

        const suara = new SpeechSynthesisUtterance(text);
        suara.lang = "id-ID";
        suara.rate = 0.9;
        suara.pitch = 1;
        suara.volume = 1;

        suara.onerror = () => {
            isSpeaking = false;
        };

        suara.onend = () => {
            
            setTimeout(() => {
                belAkhir.pause();
                belAkhir.currentTime = 0;
                belAkhir.play();

                belAkhir.onended = () => {
                    isSpeaking = false;
                };
            }, 500);
        };

        window.speechSynthesis.speak(suara);

    }, 1200);
}

/* ==========================
   HAPUS RIWAYAT
========================== */
function hapusRiwayat() {
    const yakin = confirm("Yakin ingin menghapus SEMUA riwayat antrian?");
    if (!yakin) return;

    localStorage.removeItem("antrianData");

    renderRiwayat();

    alert("Riwayat berhasil dihapus");
}
/* ==========================
   EXPORT RIWAYAT KE EXCEL
========================== */
function exportExcel() {
    if (typeof XLSX === "undefined") {
        alert("Library Excel belum termuat");
        return;
    }

    const data = getData();
    if (data.length === 0) {
        alert("Tidak ada data untuk di-export");
        return;
    }

    const sheetData = [
        ["No Urut", "No SI", "Gate", "Status", "Waktu"]
    ];

    data.forEach(item => {
        sheetData.push([
            item.no,
            item.si,
            item.gate,
            item.status,
            item.waktu
        ]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    ws["!cols"] = [
        { wch: 12 },
        { wch: 15 },
        { wch: 10 },
        { wch: 14 },
        { wch: 22 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Riwayat");

    const tanggal = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `Riwayat_Antrian_${tanggal}.xlsx`);
}


/* ==========================
   STORAGE FIDS
========================== */
let lastRenderedCreated = null;

/* ==========================
   STORAGE
========================== */

function getFIDS() {
    return JSON.parse(localStorage.getItem("fidsData")) || [];
}

function saveFIDS(data) {
    localStorage.setItem("fidsData", JSON.stringify(data));
}

/* ==========================
   TAMBAH DATA
========================== */

function tambahFIDS() {
    const data = getFIDS();

    const newItem = {
         id: Date.now().toString() + Math.random().toString(36).substr(2,5),
        created: new Date().toISOString(),

        si: si.value,
        qty: qty.value,
        teus: teus.value,
        ctrSize: ctrSize.value,
        pckType: pckType.value,
        loadingMethod: loadingMethod.value,
        customer: customer.value,
        ctrStatus: ctrStatus.value,
        vessel: vessel.value,
        closing: closing.value,
        gate: gate.value,
        warehouse: warehouse.value,
        picking: picking.value,
        loading: loading.value,
        custom: custom.value,
        shipment: shipment.value,
        tc: tc.value
    };

    data.push(newItem);
    saveFIDS(data);
 
    renderFIDS();

    alert("Data FIDS berhasil ditambahkan");
    document.querySelectorAll(
        "#si, #qty, #teus, #ctrSize, #pckType, #loadingMethod, #customer, #ctrStatus, #vessel, #closing, #gate, #warehouse, #picking, #loading, #custom, #shipment, #tc"
    ).forEach(el => el.value = "");

    si.focus();
}

/* ==========================
   RENDER
========================== */
let highlightedCreated = null;

function getFIDS() {
    return JSON.parse(localStorage.getItem("fidsData")) || [];
}

function saveFIDS(data) {
    localStorage.setItem("fidsData", JSON.stringify(data));
}

function setPriority(id) {
    let data = getFIDS();

    data.forEach(item => {
        if (item.id === id) {
            item.priority = !item.priority;
        }
    });

    saveFIDS(data);
    renderFIDS();
}
function editData(id) {
    const data = getFIDS();
   const item = data.find(d => d.id === id);
    if (!item) return;

   document.getElementById("editCreated").value = item.id;
    document.getElementById("editVessel").value = item.vessel;
    document.getElementById("editSI").value = item.si;
    document.getElementById("editQty").value = item.qty;
    document.getElementById("editTeus").value = item.teus;
    document.getElementById("editCtrSize").value = item.ctrSize;
    document.getElementById("editPckType").value = item.pckType;
    document.getElementById("editLoadingMethod").value = item.loadingMethod;
    document.getElementById("editCustomer").value = item.customer;
    document.getElementById("editCtrStatus").value = item.ctrStatus;
    document.getElementById("editClosing").value = item.closing;
    document.getElementById("editGate").value = item.gate;
    document.getElementById("editWarehouse").value = item.warehouse;
    document.getElementById("editPicking").value = item.picking;
    document.getElementById("editLoading").value = item.loading;
    document.getElementById("editCustom").value = item.custom;
    document.getElementById("editShipment").value = item.shipment;
    document.getElementById("editTC").value = item.tc;

    document.getElementById("editModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("editModal").style.display = "none";
}

function saveEdit() {
    const data = getFIDS();
    const id = document.getElementById("editCreated").value;
const item = data.find(d => d.id === id);
    if (!item) return;

    item.vessel = document.getElementById("editVessel").value;
    item.si = document.getElementById("editSI").value;
    item.qty = document.getElementById("editQty").value;
    item.teus = document.getElementById("editTeus").value;
    item.ctrSize = document.getElementById("editCtrSize").value;
    item.pckType = document.getElementById("editPckType").value;
    item.loadingMethod = document.getElementById("editLoadingMethod").value;
    item.customer = document.getElementById("editCustomer").value;
    item.ctrStatus = document.getElementById("editCtrStatus").value;
    item.closing = document.getElementById("editClosing").value;
    item.gate = document.getElementById("editGate").value;
    item.warehouse = document.getElementById("editWarehouse").value;
    item.picking = document.getElementById("editPicking").value;
    item.loading = document.getElementById("editLoading").value;
    item.custom = document.getElementById("editCustom").value;
    item.shipment = document.getElementById("editShipment").value;
    item.tc = document.getElementById("editTC").value;

    saveFIDS(data);
    closeModal();
    renderFIDS();
}


function ensureIDs() {
    let data = getFIDS();
    let updated = false;

    data.forEach(item => {
        if (!item.id) {
            item.id = Date.now().toString() + Math.random().toString(36).substr(2,5);
            updated = true;
        }
    });

    if (updated) {
        saveFIDS(data);
    }
}

function renderFIDS() {
    const data = getFIDS();
    const tbody = document.getElementById("fidsList");
    if (!tbody) return;

    tbody.innerHTML = "";

    // SORT: PRIORITY DULU → CREATED TERBARU
    
    data.forEach((d, index) => {
        const tr = document.createElement("tr");

        if (index === 0) {
            tr.classList.add("new-row");
        }

        tr.innerHTML = `
            <td>${d.vessel}</td>
            <td>${d.si}</td>
            <td>${d.qty}</td>
            <td>${d.teus}</td>
            <td>${d.ctrSize}</td>
            <td>${d.pckType}</td>
            <td>${d.loadingMethod}</td>
            <td>${d.customer}</td>
            <td class="status-${d.ctrStatus}">${d.ctrStatus}</td>
            
 <td>${formatTanggal(d.closing)}</td>
            <td>${d.gate}</td>
            <td>${d.warehouse}</td>
            <td class="status-${d.picking}">${d.picking}</td>
            <td class="status-${d.loading}">${d.loading}</td>
            <td class="status-${d.custom}">${d.custom}</td>
            <td class="status-${d.shipment}">${d.shipment}</td>
            <td>${d.tc}</td>
            <td>
               <button class="btn-priority" data-id="${d.id}">⬆</button>
                <button class="btn-edit"  data-id="${d.id}">✏</button>
            </td>
        `;

        tbody.appendChild(tr);
    });

}

/* ==========================
   Format
========================== */

function formatTanggal(dateTime) {
    if (!dateTime) return "-";

    const date = new Date(dateTime);
    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

function openFIDS() {
    window.open("monitor.html", "_blank");
}
function resetRiwayatFIDS() {
  const yakin = confirm("Yakin reset semua riwayat FIDS?");
  if (!yakin) return;

  localStorage.removeItem("fidsData");
  renderFIDS();
}



/* ==========================
   LOAD SAAT HALAMAN DIBUKA
========================== */

window.addEventListener("DOMContentLoaded", renderFIDS);

function formatTanggal(dateTime) {
    if (!dateTime) return "-";

    const date = new Date(dateTime);
    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}
function updateFIDSClock() {
    const clock = document.getElementById("fidsClock");
    if (!clock) return;

    const now = new Date();

    const jam = now.getHours().toString().padStart(2, "0");
    const menit = now.getMinutes().toString().padStart(2, "0");
    const detik = now.getSeconds().toString().padStart(2, "0");

    clock.textContent = `${jam}:${menit}:${detik}`;
}

setInterval(updateFIDSClock, 1000);
updateFIDSClock();


const clock = document.querySelector(".analog-clock");

if (clock) {
    for (let i = 0; i < 12; i++) {
        const tick = document.createElement("div");
        tick.classList.add("tick");
        tick.style.transform = `translateX(-50%) rotate(${i * 30}deg)`;
        clock.appendChild(tick);
    }
}

function updateClock() {
    const hourHand = document.querySelector(".hour");
    const minuteHand = document.querySelector(".minute");
    const secondHand = document.querySelector(".second");

    if (!hourHand || !minuteHand || !secondHand) return;

    const now = new Date();

    const hour = now.getHours() % 12;
    const minute = now.getMinutes();
    const second = now.getSeconds();

    const hourDeg = (hour * 30) + (minute * 0.5);
    const minuteDeg = minute * 6;
    const secondDeg = second * 6;

    hourHand.style.transform =
        `translateX(-50%) rotate(${hourDeg}deg)`;

    minuteHand.style.transform =
        `translateX(-50%) rotate(${minuteDeg}deg)`;

    secondHand.style.transform =
        `translateX(-50%) rotate(${secondDeg}deg)`;
}


setInterval(updateClock, 1000);
updateClock();

function exportFIDS() {
    const data = getFIDS();

    if (data.length === 0) {
        alert("Tidak ada data untuk diexport.");
        return;
    }

    // urut terbaru di atas
    data.sort((a, b) => new Date(b.created) - new Date(a.created));

    const formattedData = data.map(d => ({
        Vessel: d.vessel,
        SI: d.si,
        QTY: d.qty,
        TEUS: d.teus,
        "CTR Size": d.ctrSize,
        "Packing Type": d.pckType,
        "Loading Method": d.loadingMethod,
        Customer: d.customer,
        "CTR Status": d.ctrStatus,
        Closing: formatTanggal(d.closing),
        Gate: d.gate,
        Warehouse: d.warehouse,
        Picking: d.picking,
        Loading: d.loading,
        Custom: d.custom,
        Shipment: d.shipment,
        TC: d.tc
    }));

    // buat worksheet
    const ws = XLSX.utils.json_to_sheet(formattedData);

    // AUTO COLUMN WIDTH
    const colWidths = Object.keys(formattedData[0]).map(key => ({
        wch: Math.max(
            key.length,
            ...formattedData.map(row => (row[key] ? row[key].toString().length : 0))
        ) + 2
    }));
    ws['!cols'] = colWidths;

    // AUTO FILTER (biar bisa langsung filter di Excel)
    const range = XLSX.utils.decode_range(ws['!ref']);
    ws['!autofilter'] = { ref: ws['!ref'] };

    // buat workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FIDS Data");

    // nama file pakai tanggal hari ini
    const today = new Date().toISOString().slice(0,10);
    XLSX.writeFile(wb, `PIDS_DATA${today}.xlsx`);
}
const texts = ["PLANNING INFORMATION DISPLAY SYSTEM", "LOADING ", "CONTAINER", "WAREHOUSE"];
let currentIndex = 0;

setInterval(() => {
    currentIndex = (currentIndex + 1) % texts.length;
    document.getElementById("marqueeText").textContent = texts[currentIndex];
}, 12000); // samakan dengan durasi animasi

function importExcel() {
    const fileInput = document.getElementById("excelFile");
    const file = fileInput.files[0];

    if (!file) {
        alert("Pilih file Excel dulu");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);

        const workbook = XLSX.read(data, { 
            type: "array",
            cellDates: true
        });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            raw: false,
            dateNF: "dd/mm/yyyy"
        });

        let existingData = getFIDS();

        jsonData.forEach(row => {

            existingData.push({
                 id: Date.now().toString() + Math.random().toString(36).substr(2,5),
                vessel: row["Vessel"] || "",
                si: row["SI"] || "",
                qty: row["QTY"] || "",
                teus: row["TEUS"] || "",
                ctrSize: row["CTR Size"] || "",
                pckType: row["Packing Type"] || "",
                loadingMethod: row["Loading Method"] || "",
                customer: row["Customer"] || "",
                ctrStatus: row["CTR Status"] || "",
                closing: row["Closing"] ? row["Closing"] : "",

                gate: row["Gate"] || "",
                warehouse: row["Warehouse"] || "",
                picking: row["Picking"] || "",
                loading: row["Loading"] || "",
                custom: row["Custom"] || "",
                shipment: row["Shipment"] || "",
                tc: row["TC"] || "",
                priority: false,
                created: new Date().toISOString()
            });

        });

        saveFIDS(existingData);
        renderFIDS();

        alert("Data berhasil diimport!");
    };

    reader.readAsArrayBuffer(file);
}

document.addEventListener("click", function(e) {

    if (e.target.classList.contains("btn-priority")) {
        const id = e.target.getAttribute("data-id");
        moveToTop(id);
    }

    if (e.target.classList.contains("btn-edit")) {
        const id = e.target.getAttribute("data-id");
        editData(id);
    }

});

function moveToTop(id) {
    let data = getFIDS();

    const index = data.findIndex(item => item.id === id);
    if (index === -1) return;

    const selectedItem = data.splice(index, 1)[0];
    data.unshift(selectedItem);

    saveFIDS(data);
    renderFIDS();
}

/* ==========================
   STATISTIK CHART (MONITOR)
========================== */
let dailyChartInstance = null; 

function renderChart() {
    const ctx = document.getElementById("dailyChart");
    if (!ctx) return;

    const dataAntrian = JSON.parse(localStorage.getItem("antrianData")) || [];
    const stats = {};
    dataAntrian.forEach(item => {
        if (item.created) {
            const date = new Date(item.created).toLocaleDateString("id-ID", { 
                day: '2-digit', 
                month: '2-digit' 
            });
            stats[date] = (stats[date] || 0) + 1;
        }
    });

    if (dailyChartInstance) {
        dailyChartInstance.destroy(); 
    }

    if (typeof Chart === 'undefined') {
        console.error("Library Chart.js belum dimuat!");
        return;
    }

    dailyChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(stats),
            datasets: [{
                data: Object.values(stats),
                backgroundColor: "#38bdf8",
                borderRadius: 3,
                barPercentage: 0.6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { 
                    grid: { display: false },
                    ticks: { color: "#38bdf8", font: { size: 7 } } 
                },
                y: { 
                    beginAtZero: true,
                    suggestedMax: 5,
                    grid: { color: "rgba(255,255,255,0.05)" },
                    ticks: { color: "#38bdf8", font: { size: 7 }, stepSize: 1 }
                }
            }
        }
    });
}

/* ==========================
   LISTENERS (PEMICU UPDATE)
========================== */
window.addEventListener('storage', (e) => {
    if (e.key === "antrianData") {
        console.log("Data baru terdeteksi, mengupdate chart...");
        renderChart();
    }
});

document.addEventListener("DOMContentLoaded", renderChart);