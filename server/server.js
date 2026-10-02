const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const parcels = [
  {
    id: 1,
    trackingNumber: "TH123456789",
    recipient: "Supakorn",
    carrier: "Kerry Express",
    status: "In Transit",
    category: "Electronics",
  },
  {
    id: 2,
    trackingNumber: "TH987654321",
    recipient: "Ladthika",
    carrier: "Flash Express",
    status: "Delivered",
    category: "Clothing",
  },
  {
    id: 3,
    trackingNumber: "TH555555555",
    recipient: "Supakorn",
    carrier: "J&T Express",
    status: "Preparing",
    category: "Books",
  },
];

// Test route
app.get("/", (req, res) => {
  res.send("Parcel Tracker API is running!");
});
app.get("/api/parcels", (req, res) => {
  const { status } = req.query;

  if (status) {
    const filteredParcels = parcels.filter(
      (parcel) => parcel.status.toLowerCase() === status.toLowerCase(),
    );

    return res.json(filteredParcels);
  }

  res.json(parcels);
});
app.get("/api/parcels/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const parcel = parcels.find((parcel) => parcel.id === id);

  if (!parcel) {
    return res.status(404).json({
      message: "Parcel not found",
    });
  }

  res.json(parcel);
});
app.post("/api/parcels", (req, res) => {
  const { trackingNumber, recipient, carrier, status, category } = req.body;

  // ตรวจสอบข้อมูลที่จำเป็น
  if (!trackingNumber || !recipient || !carrier || !status || !category) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  // สร้างพัสดุใหม่
  const newParcel = {
    id:
      parcels.length > 0
        ? Math.max(...parcels.map((parcel) => parcel.id)) + 1
        : 1,
    trackingNumber,
    recipient,
    carrier,
    status,
    category,
  };

  parcels.push(newParcel);

  res.status(201).json(newParcel);
});
app.patch("/api/parcels/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const parcel = parcels.find((parcel) => parcel.id === id);

  if (!parcel) {
    return res.status(404).json({
      message: "Parcel not found",
    });
  }

  const { trackingNumber, recipient, carrier, status, category } = req.body;

  if (trackingNumber !== undefined) {
    parcel.trackingNumber = trackingNumber;
  }

  if (recipient !== undefined) {
    parcel.recipient = recipient;
  }

  if (carrier !== undefined) {
    parcel.carrier = carrier;
  }

  if (status !== undefined) {
    parcel.status = status;
  }

  if (category !== undefined) {
    parcel.category = category;
  }

  res.json(parcel);
});
app.delete("/api/parcels/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const parcelIndex = parcels.findIndex((parcel) => parcel.id === id);

  if (parcelIndex === -1) {
    return res.status(404).json({
      message: "Parcel not found",
    });
  }

  parcels.splice(parcelIndex, 1);

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
