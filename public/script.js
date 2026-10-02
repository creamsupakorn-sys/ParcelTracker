const parcelList = document.getElementById("parcelList");
const statusFilter = document.getElementById("statusFilter");

// ดึงข้อมูลพัสดุจาก API
async function loadParcels() {
  const status = statusFilter.value;

  let url = "/api/parcels";

  if (status) {
    url += `?status=${encodeURIComponent(status)}`;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to load parcels");
    }

    const parcels = await response.json();

    displayParcels(parcels);
  } catch (error) {
    console.error(error);
    parcelList.innerHTML = "<p>Unable to load parcels.</p>";
  }
}

// แสดงพัสดุบนหน้าเว็บ
function displayParcels(parcels) {
  parcelList.innerHTML = "";

  if (parcels.length === 0) {
    parcelList.innerHTML = "<p>No parcels found.</p>";
    return;
  }

  parcels.forEach((parcel) => {
    const parcelCard = document.createElement("div");

    parcelCard.className = "parcel-card";

    parcelCard.innerHTML = `
            <h3>📦 ${parcel.trackingNumber}</h3>

            <p>
                <strong>Recipient:</strong>
                ${parcel.recipient}
            </p>

            <p>
                <strong>Carrier:</strong>
                ${parcel.carrier}
            </p>

            <p>
                <strong>Status:</strong>
                ${parcel.status}
            </p>

            <p>
                <strong>Category:</strong>
                ${parcel.category}
            </p>

            <div class="actions">
                <button onclick="editParcel(${parcel.id})">
                    Edit
                </button>

                <button onclick="deleteParcel(${parcel.id})">
                    Delete
                </button>
            </div>
        `;

    parcelList.appendChild(parcelCard);
  });
}

// เมื่อเปลี่ยน Filter
statusFilter.addEventListener("change", loadParcels);

// โหลดข้อมูลครั้งแรก
loadParcels();

// เพิ่มพัสดุใหม่
const parcelForm = document.getElementById("parcelForm");

parcelForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const parcelData = {
    trackingNumber: document.getElementById("trackingNumber").value,
    recipient: document.getElementById("recipient").value,
    carrier: document.getElementById("carrier").value,
    status: document.getElementById("status").value,
    category: document.getElementById("category").value,
  };

  try {
    const response = await fetch("/api/parcels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parcelData),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert("Parcel added successfully!");

    parcelForm.reset();

    loadParcels();
  } catch (error) {
    console.error(error);
    alert("Unable to add parcel.");
  }
});
// ลบพัสดุ
async function deleteParcel(id) {
  const confirmDelete = confirm("Are you sure you want to delete this parcel?");

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(`/api/parcels/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.message);
      return;
    }

    alert("Parcel deleted successfully!");

    loadParcels();
  } catch (error) {
    console.error(error);
    alert("Unable to delete parcel.");
  }
}
async function editParcel(id) {
  document.querySelectorAll(".edit-box").forEach((box) => box.remove());
  try {
    // ดึงข้อมูลพัสดุเดิม
    const response = await fetch(`/api/parcels/${id}`);

    if (!response.ok) {
      const data = await response.json();
      alert(data.message);
      return;
    }

    const parcel = await response.json();

    // สร้างกล่อง Edit
    const editBox = document.createElement("div");
    editBox.className = "edit-box";

    editBox.innerHTML = `
            <div class="edit-content">

                <h2>Edit Parcel</h2>

                <label>Tracking Number</label>
                <input
                    type="text"
                    id="editTrackingNumber"
                    value="${parcel.trackingNumber}"
                >

                <label>Recipient</label>
                <input
                    type="text"
                    id="editRecipient"
                    value="${parcel.recipient}"
                >

                <label>Carrier</label>
                <select id="editCarrier">
                    <option value="Kerry Express">Kerry Express</option>
                    <option value="Flash Express">Flash Express</option>
                    <option value="J&T Express">J&T Express</option>
                    <option value="Thailand Post">Thailand Post</option>
                </select>

                <label>Status</label>
                <select id="editStatus">
                    <option value="Preparing">Preparing</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>

                <label>Category</label>
                <select id="editCategory">
                    <option value="Document">Document</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Food">Food</option>
                    <option value="Cosmetics">Cosmetics</option>
                    <option value="Books">Books</option>
                    <option value="Household Items">Household Items</option>
                    <option value="Other">Other</option>
                </select>

                <div class="edit-actions">
                    <button id="saveEdit">Save Changes</button>
                    <button id="cancelEdit">Cancel</button>
                </div>

            </div>
        `;

    document.body.appendChild(editBox);

    // เลือกค่าปัจจุบันของพัสดุ
    document.getElementById("editCarrier").value = parcel.carrier;
    document.getElementById("editStatus").value = parcel.status;
    document.getElementById("editCategory").value = parcel.category;

    // ปุ่ม Cancel
    document.getElementById("cancelEdit").addEventListener("click", () => {
      editBox.remove();
    });

    // ปุ่ม Save
    document.getElementById("saveEdit").addEventListener("click", async () => {
      const updatedParcel = {
        trackingNumber: document
          .getElementById("editTrackingNumber")
          .value.trim(),

        recipient: document.getElementById("editRecipient").value.trim(),

        carrier: document.getElementById("editCarrier").value,

        status: document.getElementById("editStatus").value,

        category: document.getElementById("editCategory").value,
      };

      // ตรวจสอบข้อมูล
      if (
        !updatedParcel.trackingNumber ||
        !updatedParcel.recipient ||
        !updatedParcel.carrier ||
        !updatedParcel.status ||
        !updatedParcel.category
      ) {
        alert("Please complete all fields.");
        return;
      }

      try {
        const updateResponse = await fetch(`/api/parcels/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedParcel),
        });

        const data = await updateResponse.json();

        if (!updateResponse.ok) {
          alert(data.message);
          return;
        }

        alert("Parcel updated successfully!");

        editBox.remove();

        // โหลดข้อมูลใหม่โดยไม่ Refresh หน้า
        loadParcels();
      } catch (error) {
        console.error(error);
        alert("Unable to update parcel.");
      }
    });
  } catch (error) {
    console.error(error);
    alert("Unable to load parcel.");
  }
}
