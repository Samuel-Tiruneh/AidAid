import RequesterImg from "../../assets/DonateAssets/requester.jpg";
import AttachedPhoto1 from "../../assets/DonateAssets/requester.jpg";
import AttachedPhoto2 from "../../assets/DonateAssets/requester2.jpg";
import AttachedVideo from "../../assets/DonateAssets/video.webm";
import AttachedDocument1 from "../../assets/DonateAssets/doc.pdf";
import AttachedDocument2 from "../../assets/DonateAssets/doc.pdf";
const donationData = [
  {
    name: "Alemu Kebede",
    age: 22,
    gender: "Male",
    location: "Addis Ababa",
    category: "Medical",
    description:
      "Alemu was diagnosed with a critical heart condition and requires urgent surgery.",
    neededAmount: "10,000 ETB",
    RequesterImg,
    AttachedPhoto: [AttachedPhoto1, AttachedPhoto2],
    AttachedVideo,
    AttachedDocument: [AttachedDocument1, AttachedDocument2],
  },
  {
    name: "Tigest Sisay",
    age: 30,
    gender: "Female",
    location: "Adama",
    category: "Medical",
    description: "Needs financial assistance for urgent surgery.",
    neededAmount: "12,000 ETB",
    RequesterImg,
    AttachedPhoto: [AttachedPhoto1],
    AttachedVideo: "https://www.example.com/video2",
    AttachedDocument: ["https://www.example.com/document3"],
  },
  {
    name: "Bekele Tadesse",
    age: 45,
    gender: "Male",
    location: "Bahir Dar",
    category: "Education",
    description:
      "Bekele is a dedicated teacher who lost his teaching materials in a fire and needs funds to rebuild.",
    neededAmount: "8,000 ETB",
    RequesterImg,
    AttachedPhoto: [AttachedPhoto1],
    AttachedVideo: "https://www.example.com/video3",
    AttachedDocument: ["https://www.example.com/document4"],
  },
  {
    name: "Meron Alemayehu",
    age: 28,
    gender: "Female",
    location: "Hawassa",
    category: "Medical",
    description: "Meron needs chemotherapy treatment for cancer.",
    neededAmount: "50,000 ETB",
    RequesterImg,
    AttachedPhoto: [AttachedPhoto1, AttachedPhoto1],
    AttachedVideo,
    AttachedDocument: [AttachedDocument1],
  },
  {
    name: "Kebede Fekadu",
    age: 36,
    gender: "Male",
    location: "Dire Dawa",
    category: "Emergency Relief",
    description:
      "Kebede's house was destroyed by flooding, and he needs support to rebuild his home.",
    neededAmount: "20,000 ETB",
    RequesterImg,
    AttachedPhoto: [AttachedPhoto1],
    AttachedVideo: "https://www.example.com/video4",
    AttachedDocument: ["https://www.example.com/document5"],
  },
  {
    name: "Senait Abebe",
    age: 24,
    gender: "Female",
    location: "Jimma",
    category: "Education",
    description:
      "Senait is a university student struggling to afford tuition and materials.",
    neededAmount: "15,000 ETB",
    RequesterImg,
    AttachedPhoto: [AttachedPhoto1],
    AttachedVideo,
    AttachedDocument: [AttachedDocument1],
  },
  {
    name: "Abebe Girma",
    age: 50,
    gender: "Male",
    location: "Gondar",
    category: "Medical",
    description:
      "Abebe has been diagnosed with kidney failure and needs dialysis treatment.",
    neededAmount: "30,000 ETB",
    RequesterImg,
    AttachedPhoto: [AttachedPhoto1],
    AttachedVideo: "https://www.example.com/video5",
    AttachedDocument: ["https://www.example.com/document7"],
  },
  {
    name: "Lemlem Yohannes",
    age: 40,
    gender: "Female",
    location: "Mekelle",
    category: "Small Business",
    description:
      "Lemlem is a single mother seeking funds to start a small business to support her children.",
    neededAmount: "7,500 ETB",
    RequesterImg,
    AttachedPhoto: [AttachedPhoto1],
    AttachedVideo,
    AttachedDocument: [AttachedDocument1],
  },
  {
    name: "Tesfaye Mengistu",
    age: 55,
    gender: "Male",
    location: "Harar",
    category: "Emergency Relief",
    description:
      "Tesfaye lost his farmland due to a drought and needs support to restart farming.",
    neededAmount: "18,000 ETB",
    RequesterImg,
    AttachedPhoto: [AttachedPhoto1],
    AttachedVideo: "https://www.example.com/video6",
    AttachedDocument: ["https://www.example.com/document9"],
  },
  {
    name: "Hana Mesfin",
    age: 19,
    gender: "Female",
    location: "Debre Birhan",
    category: "Education",
    description:
      "Hana is an aspiring doctor who needs financial assistance for medical school tuition.",
    neededAmount: "40,000 ETB",
    RequesterImg,
    AttachedPhoto: [AttachedPhoto1, AttachedPhoto1],
    AttachedVideo,
    AttachedDocument: [AttachedDocument1],
  },
];

export default donationData;

