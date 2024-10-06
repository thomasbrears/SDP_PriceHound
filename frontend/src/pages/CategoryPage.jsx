import React, { useState } from 'react';
import MainHeadTitle from '../components/MainHeadTitle'; 
import '../css/CategoryPage.css'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Dynamically set the search API URL based on environment
const searchApiUrl = process.env.NODE_ENV === 'production'
? 'https://pricehound.tech/api/search'
: 'http://localhost:8000/api/search';

function CategoryPage() {
  // State variables for selected category, subcategories, and loading status
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const navigate = useNavigate();

  // Object containing all top-level, second-level, and third-level category data
  const categoriesData = {
    "Phones": [ // Top level category
      { secondLevel: "Phones", thirdLevel: ["Android Phones", "iPhones", "Samsung Phones", "Oppo Phones", "Budget Phones", "Foldable Phones", "Home Phones", "VOIP Phones"] }, // Second then third level categories
      { secondLevel: "Accessories", thirdLevel: ["Phone Cases", "Screen Protectors", "Handsfree Kits", "Sim Cards", "Power Banks"] },
      { secondLevel: "Smart Watches", thirdLevel: ["Apple Watch", "Samsung Watch", "Ultra Smart Watch", "Fitbit"] },
      { secondLevel: "Chargers", thirdLevel: ["USB-C Charger", "Lighting Charger", "Micro USB Charger", "Wireless Charger", "Magsafe Charger"] }
    ],
    "Cameras": [
      { secondLevel: "Digital Cameras", thirdLevel: ["DSLRs", "Mirrorless Cameras", "Compact Cameras", "Instant Cameras"] },
      { secondLevel: "Lenses", thirdLevel: ["Wide-Angle Lenses", "Telephoto Lenses", "Prime Lenses", "Zoom Lenses"] },
      { secondLevel: "Accessories", thirdLevel: ["Camera Bags","Camera Batteries", "Tripods", "Memory Cards", "Camera Flashes"] },
      { secondLevel: "Drones", thirdLevel: ["Drones", "Drone Parts", "Drone Batteries", "Propellers", "Quadcopters"] },

    ],
    "Computers": [
      { secondLevel: "Desktops", thirdLevel: ["Gaming Desktops", "Workstations","iMac", "PCs", "Mini PCs"] },
      { secondLevel: "Laptops", thirdLevel: ["Gaming Laptops", "Business Laptops", "Macbooks", "Ultrabooks"] },
      { secondLevel: "Tablets", thirdLevel: ["Android Tablets", "iPads", "Windows Tablets", "E-Readers"] },
      { secondLevel: "Computer Components", thirdLevel: ["Graphics Cards", "SPUs", "Motherboards", "PC Power Supplies", "Sound Cards", "Computer Cases", "Computer Cables"] },
      { secondLevel: "Computer Hardware", thirdLevel: ["Monitors", "Server Cabinets", "Servers", "Computer Sticks"] },
      { secondLevel: "Peripherals", thirdLevel: ["Keybords", "Mouse", "Microphones", "Webcams", "Scanners", "Numerical Keypads"] },
      { secondLevel: "Printers", thirdLevel: ["Printer Cartridges", "Inkjet Printers", "Lazer Printers", "3D Printers", "Label and Receipt Printers", "Photo Printers"] },
      { secondLevel: "Hard Drives", thirdLevel: ["External Hard Drives", "SSD Solid State Drives", "NAS Hard Drives", "SATA Hard Drives", "SAS Server Hard Drives", "SCSI Server Hard Drives"] },
      { secondLevel: "Networking", thirdLevel: ["Hubs and Switches", "Routers", "Wireless Access Points", "Wireless Adapters", "Mobile WIFI Routers", "VoIP Gateways", "Print Servers"] },
      { secondLevel: "Memory Cards", thirdLevel: ["SD Memory Cards", "Micro SB Cards", "USB", "Compact Flash", "Memory Sticks"] },
      { secondLevel: "Computer Memory", thirdLevel: ["DDR4 Memory", "DDR5 Memory", "DDR3 Memory", "DDR2 Memory", "DDR Memory", "SDRAM Memory", "Memory Assessories"] },
      { secondLevel: "POS Gear", thirdLevel: ["Barcode Scanner", "Cash Drawers", "POS Consumables", "POS Card Readers", "POS Systems"] },
    ],
    "Appliances": [
      { secondLevel: "Laundry & Cleaning", thirdLevel: ["Washing Machines", "Vacuum Cleaners", "Dishwashers", "Dryers", "Washer & Dryer Packs", "Sewing Machines", "Laundry Tubs", "Ironing Boards", "Laundry Accessories"] },
      { secondLevel: "Commercial Kitchen Appliances", thirdLevel: ["Food Preparation Equipment", "Commercial Dishwashers and Glasswashers", "Cooking Equipment", "Refrigeration & Ice Machines"] },
      { secondLevel: "Appliances Cooking", thirdLevel: ["Ovens & Cooktops", "Rangehoods", "Microwave Ovens", "Splashbacks"] },
      { secondLevel: "Fridges & Freezers", thirdLevel: ["Fridge Freezers", "Fridges", "Wine Storage", "Chest Freezers", "Freezers", "Mini Fridges", "Ice Maker"] },
      { secondLevel: "Kitchen", thirdLevel: ["Cookware", "Waste Disposals", "Food Storage", "Kitchen Knives", "Kitchen Equipment", "Water Bottles", "Food Storage & Sealers", "Bottles & Jugs", "Food Steamers", "Meat Mincers", "Cookie Cutters", "Kitchen Timers", "Spoons", "Tea Pots"] },
      { secondLevel: "Heating & Cooling", thirdLevel: ["Heat Pumps & Air Conditioners", "Dehumidifiers", "Air Purifiers", "Oil Heaters", "Ceramic Heaters", "Electric Blankets", "Electric Fans", "Electric Heaters", "Panel Heater", "Convection Heaters", "Electric Fire Heater", "Radiant/Bar Heaters", "Fan Heaters", "Air Coolers", "Humidifiers", "Gas Heaters", "Wood Fires"] },    
    ],
    "Sound": [
      { secondLevel: "Portable Audio", thirdLevel: ["Earphones", "Headphones", "Headsets", "Portable Radios", "Bluetooth Headsets", "DACs", "Turntables"] },
      { secondLevel: "Speakers", thirdLevel: ["Portable & Mobile Speakers", "Surround & Bookshelf Speakers", "Computer Speakers", "Floorstanding Speakers", "Built-in Speakers", "Outdoor Speakers", "Center Speakers"] },
      { secondLevel: "Home Audio Systems", thirdLevel: ["Soundbars", "Amplifiers & Receivers", "Micro Systems", "Mini Systems", "Home Theaters", "Speaker Docking Stations"] },
      { secondLevel: "Pro Audio & DJ Equipment", thirdLevel: ["PA Speakers", "PA Subwoofers", "Studio Microphones", "PA Systems Complete"] },
      { secondLevel: "Marine Electronics", thirdLevel: ["VHF & UHF Radios", "Marine Speakers", "Outdoor Compasses", "Radars", "TV Sat or Aerial"] },
      { secondLevel: "Gadgets", thirdLevel: ["Digital Voice Recorders", "Breathalysers"] },
      { secondLevel: "Musical Instruments", thirdLevel: ["Brass", "Wind & Woodwind"] },
    ],
    "Vision": [
      { secondLevel: "TVs", thirdLevel: ["LED TVs", "OLED TVs", "QLED TVs", "4K TVs", "Smart TVs"] },
      { secondLevel: "Tablets", thirdLevel: ["Android Tablets", "iPads", "Windows Tablets", "Kids Tablets", "Convertible Tablets"] },
      { secondLevel: "Projectors", thirdLevel: ["Home Theater Projectors", "Portable Projectors", "Business Projectors", "4K Projectors", "Short Throw Projectors"] },
      { secondLevel: "GPS Receivers", thirdLevel: ["Handheld GPS", "Marine GPS", "Aviation GPS", "GPS Accessories"] },
      { secondLevel: "DVD Players & Recorders", thirdLevel: ["Blu-ray Players", "DVD Recorders", "DVD Players", "Set Top Boxes", "DVD & VCR Combo Players", "Portable DVD Players"] },
      { secondLevel: "eBook Readers", thirdLevel: ["Kindle", "Kobo", "Sony eReader"] },
      { secondLevel: "Presentation Pointers", thirdLevel: ["Laser Pointers", "Wireless Presenters"] },
      { secondLevel: "Multimedia Players", thirdLevel: ["Streaming Media Players", "Network Media Players", "Media Player Accessories"] },
      { secondLevel: "FM Transmitters", thirdLevel: ["Bluetooth FM Transmitters", "USB FM Transmitters", "Car FM Transmitters"] },
      { secondLevel: "Remote Controls", thirdLevel: ["Universal Remotes", "Learning Remotes", "Voice-Controlled Remotes"] },
      { secondLevel: "TV Sticks", thirdLevel: ["Fire TV Stick", "Chromecast", "Roku Stick"] },
      { secondLevel: "Tablet Accessories", thirdLevel: ["Tablet Stylus Pens", "Tablet Keyboards", "iPad Accessories", "Tablet Cases", "Tablet Screen Protectors"] },
      { secondLevel: "Television Accessories", thirdLevel: ["TV Brackets", "Cabinets", "Antenna & Aerials", "Cable Management"] },
      { secondLevel: "Electronics Accessories", thirdLevel: ["Projectors Accessories", "eBook Reader Accessories", "MP3 Players Accessories", "Camera Accessories", "Battery Chargers", "Cables & Adapters"] },
    ],
    "Automotive": [
      { secondLevel: "Automotive Parts & Tools", thirdLevel: ["Car Battery & Chargers", "Engine Components", "Spark Plugs", "Filters", "Brake Pads", "Timing Belts"] },
      { secondLevel: "Car Interior", thirdLevel: ["Radar Detectors", "Seat Covers", "Floor Mats", "Steering Wheel Covers", "Dash Cams"] },
      { secondLevel: "Car Audio", thirdLevel: ["Car Audio Amplifiers", "Car Speakers", "Head Units", "Car Stereo", "Car Subwoofers", "CD&DVD Receivers", "Car Equalizers", "Bluetooth Car Kits"] },
      { secondLevel: "Car Exterior", thirdLevel: ["Wheels", "Tires", "Car Covers", "Roof Racks", "Spoilers"] },
    ],
    "Clothing & Fashion": [
      { secondLevel: "Men's Clothing", thirdLevel: ["Mens Shirts", "Mens Pants", "Mens Shorts", "Mens Jackets", "Mens Suits"] },
      { secondLevel: "Women's Clothing", thirdLevel: ["Womens Dresses", "Womens Tops", "Womens Pants", "Womens Shorts", "Womens Skirts", "Womens Jeans", "Womens Activeware"] },
      { secondLevel: "Kid's Clothing", thirdLevel: ["Kids Dresses", "Kids Tops", "Kids Pants", "Kids Shorts", "Kids Skirts"] },
      { secondLevel: "Footwear", thirdLevel: ["Mens Footwear", "Womens Footwear", "Boys Footwear", "Girls Footwear", "Running Shoes", "Hiking Shoes", "Walking Shoes", "Casual Shoes"] },
      { secondLevel: "Watches", thirdLevel: ["Mens Watches", "Womens Watches", "Unisex Watches", "Smart Watches"] },
      { secondLevel: "Sunglasses", thirdLevel: ["Mens Sunglasses", "Womens Sunglasses", "Unisex Sunglasses", "Kids Sunglasses"] },
      { secondLevel: "Fassion Accessories", thirdLevel: ["Rings", "Mens Accessories", "Women Accessories"] }
    ],
    "Components": [
      { secondLevel: "CPUs", thirdLevel: ["Intel CPUs", "AMD CPUs", "Server CPUs"] },
      { secondLevel: "Graphics Cards", thirdLevel: ["NVIDIA GPUs", "AMD GPUs", "Workstation GPUs"] }
    ],
    "Games & Consoles": [
      { secondLevel: "Game Controllers", thirdLevel: ["GamePads", "Other Controllers", "VR Headsets", "Steering Wheels & Pedals", "Joysticks", "Arcade Sticks"] },
      { secondLevel: "Video Games", thirdLevel: ["Nintendo Switch", "PlayStation 4 Games", "PlayStation 5 Games", "Xbox One Games", "Xbox Games", "Nintendo Wii Games", "Nintendo Wii U Games", "PC Games", "Mobile Games"] },
      { secondLevel: "Game Consoles", thirdLevel: ["Xbox One Consoles", "Nintendo Switch Consoles", "PlayStation 5 Consoles", "PlayStation 4 Consoles", "Nintendo 3DS Consoles", "PSP Consoles", "Retro Consoles"] },
      { secondLevel: "Gaming Chairs", thirdLevel: ["Ergonomic Gaming Chairs", "Racing Style Chairs", "Rockers", "Bean Bags"] },
      { secondLevel: "Games Accessories", thirdLevel: ["Console Stands", "Charging Stations", "Headsets", "Game Storage", "Controller Skins"] },
    ],
    "Gifts & Flowers": [
      { secondLevel: "Gifts", thirdLevel: ["Food Gifts", "Baby Gifts", "Gift Baskets", "Personalized Gifts", "Anniversary Gifts", "Wedding Gifts"] },
      { secondLevel: "Flowers", thirdLevel: ["Collections", "Bouquets", "Flower Arrangements", "Potted Plants", "Seasonal Flowers"] },
    ],
    "Health & Beauty": [
      { secondLevel: "Fragrances", thirdLevel: ["Perfumes", "Mens Cologne", "Unisex Cologne", "Fragrance Gift Sets", "Body Sprays", "Roll-Ons"] },
      { secondLevel: "Personal Care", thirdLevel: ["Shave & Hair Removals", "Skincare", "Electric Toothbrushes", "Hair Dryers", "Hair Straighteners", "Hair Stylers", "Massagers", "Hair Clippers", "Body Grooming Kits"] },
      { secondLevel: "Cosmetics", thirdLevel: ["Face Makeup", "Lip Makeup", "Eye Makeup", "Nail Care", "Makeup Sets"] },
      { secondLevel: "Pharmaceuticals", thirdLevel: ["Contact Lenses", "Medical Monitors and Equipment", "Vitamins and Nutrition", "Contact Lens Care", "Diabetes Care", "First Aid Supplies", "Pain Relief"] },
      { secondLevel: "Training Supplements", thirdLevel: ["Protein Powders", "Bars & Snacks", "Pre-Workout", "Amino Acids", "Creatine"] },
      { secondLevel: "Natural Health", thirdLevel: ["Health Supplements", "Herbal Remedies", "Essential Oils", "Homeopathic Remedies"] },
      { secondLevel: "Oral Health", thirdLevel: ["Oral Irrigators", "Tongue Cleaners", "Oral Accessories", "Toothpaste", "Mouthwash"] },
      { secondLevel: "Hair Care", thirdLevel: ["Shampoos", "Conditioners", "Hair Treatments", "Hair Styling", "Hair Accessories"] },
    ],
    "Home & Garden": [
      { secondLevel: "Furniture", thirdLevel: ["Beds", "Outdoor Furniture", "Sofas", "Lounge Furniture", "Bedroom Furniture", "Dining Furniture", "Office Furniture"] },
      { secondLevel: "Smart Home", thirdLevel: ["Security Cameras", "Security Doorbells", "Smart Door Locks", "Smart Bulbs", "Voice Assistants", "Bluetooth Trackers", "Smart Home Controllers", "Smart Power", "Smart Lighting", "Smart Thermostats"] },
      { secondLevel: "Pet Supplies", thirdLevel: ["Pet Foods", "Dog Supplies", "Kennels & Cages", "Pet Bedding", "Cat Supplies", "Other Animals Care", "Birds Care", "Fish Supplies", "Reptile Supplies"] },
      { secondLevel: "Bedroom", thirdLevel: ["Mattresses", "Pillows", "Cover Sets", "Duvets & Comforters", "Pillowcases", "Blankets", "Bed Frames"] },
      { secondLevel: "Lighting", thirdLevel: ["Torches", "Outdoor lighting", "Headlamps", "Down & Spotlights", "Light Strings", "Standing Lamps", "Table Lamps", "Light Bulbs", "Ceiling Lights"] },
      { secondLevel: "Garden", thirdLevel: ["Garden Plants", "Pressure Washers", "Chainsaws", "Wheelbarrows", "Grass Trimmers", "Hedge Trimmers", "Leaf Blowers & Blower Vacs", "Lawnmowers", "Garden Tools", "Garden Furniture"] },
      { secondLevel: "Home Improvement", thirdLevel: ["Power Tools", "Swiss Army Knives", "Hand Tools", "Ladders", "Paint & Paint Accessories", "Building Materials"] },
      { secondLevel: "Bathroom", thirdLevel: ["Bathroom Fixtures", "Basin Mixers", "Bathroom Accessories", "Showerheads", "Towel Rails", "Bathroom Storage"] },
      { secondLevel: "Home Electrical", thirdLevel: ["Home Batteries", "Weather Stations", "Adhesives & Tapes", "Tool Cases", "Extension Cords", "Surge Protectors"] },
      { secondLevel: "Home Decor", thirdLevel: ["Decor Accessories", "Mirrors", "Clocks", "Wall Art", "Cushions & Throws", "Curtains & Blinds"] },
      { secondLevel: "BBQs & Outdoor Cooking", thirdLevel: ["BBQ Barbeques", "Smoker Ovens", "Grill Accessories", "Portable BBQs", "BBQ Covers"] },
    ],
    "Kids & Family": [
      { secondLevel: "Toys & Hobbies", thirdLevel: ["LEGO Sets", "Baby & Toddler Toys", "Electronic Toys", "Educational Aids", "Toy Musical Instruments", "Games & Puzzles", "Bikes, Trikes & Ride Ons", "Dolls & Dollhouses", "Action Figures", "Outdoor Play", "Arts & Crafts"] },
      { secondLevel: "Feeding", thirdLevel: ["Baby Food & Formula", "Baby Plates & Cutlery", "High Chairs", "Breast Pumps & Accessories", "Breast Pads", "Sterilizers, Warmers & Drying Racks", "Teats", "Sippy Cups", "Baby Bibs"] },
      { secondLevel: "Baby Outdoors", thirdLevel: ["Car / Booster Seats", "Nappy Bags", "Prams, Strollers & Buggies", "Baby Bags", "Baby Carriers", "Portable Cots & Chairs", "Baby Car Accessories", "Travel Cots", "Stroller Accessories"] },
      { secondLevel: "Changing", thirdLevel: ["Nappies", "Wipes & Accessories", "Disposal Units", "Changing Mats", "Changing Tables"] },
      { secondLevel: "Safety", thirdLevel: ["Baby Monitors", "Gates & Locks", "Corner Protectors", "Baby Proofing Kits"] },
      { secondLevel: "Nursery", thirdLevel: ["Baby Bedding & Linen", "Nursery Furniture", "Cribs, Cots & Bassinets", "Nursery Decor", "Baby Mobiles"] },
      { secondLevel: "Baby Clothes", thirdLevel: ["Baby Sleepwear & Bags", "Bodysuits", "Onesies", "Baby Outerwear", "Baby Socks & Mittens"] },
      { secondLevel: "Bathing & Skincare", thirdLevel: ["Talcs & Lotions", "Baby Shampoo & Body Wash", "Baby Towels", "Bath Toys", "Bath Thermometers"] },
      { secondLevel: "Activity Time", thirdLevel: ["Playtime Mats", "Baby Gyms", "Bouncers & Rockers", "Activity Centers"] },
      { secondLevel: "Baby Footwear", thirdLevel: ["Baby Slippers & Booties", "Baby Sneakers", "Baby Sandals"] },
      { secondLevel: "Toilet Training", thirdLevel: ["Potties & Trainers", "Toilet Training Seats", "Step Stools"] },
    ],
    "Office Products": [
      { secondLevel: "Office Furniture", thirdLevel: ["Chairs", "Desks", "Tables", "Step Ladders", "Bookshelves", "Filing Cabinets", "Chair Mats And Lumbar Supports", "Standing Desks", "Office Partitions"] },
      { secondLevel: "Office Technology", thirdLevel: ["Shredders", "Calculators", "Label Machines", "Laminators", "ScanNCut Machines", "Conferencing Systems", "Money Counters", "Printers", "Scanners", "Projectors"] },
      { secondLevel: "Paper & Books", thirdLevel: ["Copy Paper", "Coloured Card", "Tickets", "Book Cover", "Notebooks", "Diaries & Planners"] },
      { secondLevel: "Writing Instruments", thirdLevel: ["Pencils", "Fountain Pens", "Gel Pens", "Parker Pens", "Pen Refills & Ink", "Other Writing", "Crayons", "Markers & Highlighters", "Ballpoint Pens"] },
      { secondLevel: "Cafeteria Consumables", thirdLevel: ["Other Cafeteria", "Snack Food", "Confectionery", "Juice & Water", "Condiments", "Coffee & Tea"] },
      { secondLevel: "Office Cleaning", thirdLevel: ["Cleaning Supplies", "Rubbish Bins & Bags", "Tissues, Paper Towels & Dispensers", "Office First Aid", "Sanitizing Wipes", "Air Fresheners"] },
      { secondLevel: "Presentation", thirdLevel: ["Whiteboards", "Electronic Whiteboards", "Projector Screens", "Laser Pointers", "Presentation Binders"] },
      { secondLevel: "Office General", thirdLevel: ["Book Ends", "Dispensers", "Key Tags, Cabinets & Cash Boxes", "Desk Organizers", "Office Clocks"] },
      { secondLevel: "Filing & Storage", thirdLevel: ["Clipboards", "Concertina Files", "Tidy Files And Document Wallets", "Filing Cabinets", "Storage Boxes"] },
      { secondLevel: "Shipping Supplies", thirdLevel: ["Mailing Tubes", "Bubble Wrap", "Packing Tape", "Shipping Labels", "Envelopes"] },
      { secondLevel: "Office Accessories", thirdLevel: ["Staplers & Staples", "Hole Punches", "Scissors", "Rulers", "Rubber Bands", "Glue & Adhesives", "Tape Dispensers", "Paper Clips", "Pencil Sharpeners"] },
    ],
    "Small Appliances": [
      { secondLevel: "Coffee Machines", thirdLevel: ["Coffee Makers", "Espresso Machines", "Coffee Grinders", "Milk Frothers", "Plungers", "Capsule Coffee Machines", "Filter Coffee Machines"] },
      { secondLevel: "Blenders", thirdLevel: ["Hand Blenders", "Stand Blenders", "Personal Blenders", "Commercial Blenders"] },
      { secondLevel: "Kettles", thirdLevel: ["Electric Kettles", "Stovetop Kettles", "Temperature Control Kettles", "Travel Kettles"] },
      { secondLevel: "Snack Makers", thirdLevel: ["Sandwich Makers", "Waffle Makers", "Ice Cream Makers", "Popcorn Makers", "Egg Cookers", "Pie Makers", "Milkshake Makers", "Donut Makers", "Chocolate Fountains", "Hot Dog Makers"] },
      { secondLevel: "Other Appliances", thirdLevel: ["Toaster Ovens", "Microwaves", "Electric Skillets", "Hot Plates", "Yogurt Makers"] },
      { secondLevel: "Air Fryers", thirdLevel: ["Compact Air Fryers", "Large Capacity Air Fryers", "Multifunction Air Fryers"] },
      { secondLevel: "Toasters", thirdLevel: ["2-Slice Toasters", "4-Slice Toasters", "Toaster Ovens", "Long Slot Toasters"] },
      { secondLevel: "Ironing", thirdLevel: ["Steam Irons", "Garment Steamers", "Ironing Boards", "Ironing Accessories"] },
      { secondLevel: "Mixers", thirdLevel: ["Stand Mixers", "Hand Mixers", "Commercial Mixers", "Mixing Accessories"] },
      { secondLevel: "Food Processors", thirdLevel: ["Mini Food Processors", "Full-Size Food Processors", "Food Choppers", "Food Processor Attachments"] },
      { secondLevel: "Juicers", thirdLevel: ["Centrifugal Juicers", "Masticating Juicers", "Citrus Juicers", "Juicing Accessories"] },
      { secondLevel: "Water Filters", thirdLevel: ["Water Filter Pitchers", "Under-Sink Water Filters", "Countertop Water Filters", "Water Filter Cartridges"] },
      { secondLevel: "Rice Cookers", thirdLevel: ["Basic Rice Cookers", "Multifunction Rice Cookers", "Commercial Rice Cookers"] },
      { secondLevel: "Sodastream Syrups & Bottles", thirdLevel: ["Sodastream Flavors", "Sodastream Bottles", "CO2 Cylinders"] },
      { secondLevel: "Electric Pressure Cookers", thirdLevel: ["Multicookers", "Pressure Cookers", "Instant Pots"] },
      { secondLevel: "Drink & Soda Makers", thirdLevel: ["Soda Makers", "Cold Brew Coffee Makers", "Tea Makers"] },
      { secondLevel: "Breadmakers", thirdLevel: ["Gluten-Free Breadmakers", "Automatic Breadmakers", "Manual Breadmakers"] },
      { secondLevel: "Electrical Grills", thirdLevel: ["Indoor Grills", "Contact Grills", "Grill Presses"] },
      { secondLevel: "Water Dispensers", thirdLevel: ["Hot & Cold Water Dispensers", "Countertop Water Dispensers", "Bottleless Water Dispensers"] },
      { secondLevel: "Deep Fryers", thirdLevel: ["Compact Deep Fryers", "Large Capacity Deep Fryers", "Commercial Deep Fryers"] },
      { secondLevel: "Kitchen Scales", thirdLevel: ["Digital Kitchen Scales", "Mechanical Kitchen Scales", "Nutritional Scales"] },
      { secondLevel: "Warming Drawers", thirdLevel: ["Built-In Warming Drawers", "Freestanding Warming Drawers"] },
      { secondLevel: "Food Dehydrators", thirdLevel: ["Compact Food Dehydrators", "Large Capacity Food Dehydrators", "Commercial Food Dehydrators"] },
    ],
    "Sports & Outdoors": [
      { secondLevel: "Outdoors", thirdLevel: ["Camping", "Sleeping Bags", "Tents", "Camping Furniture", "Camping Stoves", "Backpacks", "Camping Lights", "Outdoor Clothing"] },
      { secondLevel: "Fitness Equipment", thirdLevel: ["Strength Equipment", "Treadmills", "Other Fitness Equipment", "Rowing Machines", "Boxing & Martial Arts", "Cross Trainers", "Exercycle", "Ellipticals", "Dumbbells", "Kettlebells", "Fitness Accessories", "Yoga & Pilates Equipment"] },
      { secondLevel: "Cycling", thirdLevel: ["Cycling Bike Parts", "Bikes", "Cycling Accessories", "Cycling Helmets", "Cycling Apparel", "Bike Lights", "Bike Locks"] },
      { secondLevel: "Snow", thirdLevel: ["Ski Gear", "Snowboard Gear", "Goggles", "Tuning/Tools", "Snow Boots", "Snow Jackets", "Snow Pants"] },
      { secondLevel: "Boating", thirdLevel: ["Marine Electrical", "Boating Refrigeration", "Marine Safety", "Plumbing", "Boat Motors", "Marine Electronics", "Anchors & Docking"] },
      { secondLevel: "Skate", thirdLevel: ["Electric Scooters", "Kick Scooters", "Skateboards", "Longboards", "Skateboard Parts", "Scooter Accessories"] },
      { secondLevel: "Fishing", thirdLevel: ["Reels", "Combos", "Rod Rack and Holder", "Fishing Rods", "Fishing Lures", "Fishing Line", "Fishing Nets", "Fishing Tackle Boxes"] },
      { secondLevel: "Golf", thirdLevel: ["Golf Clubs", "Golf Accessories", "Golf Balls", "Golf Bags", "Golf Clothing", "Golf Shoes"] },
      { secondLevel: "Team Sports", thirdLevel: ["Football", "Basketball", "Baseball", "Rugby", "Hockey", "Cricket"] },
      { secondLevel: "Water Sports", thirdLevel: ["Wetsuits", "Snorkeling Gear", "Diving Gear", "Water Skis", "Wakeboards", "Kayaks", "Paddleboards"] },
      { secondLevel: "Aviation", thirdLevel: ["Flight Computers", "Pilot Kneeboards", "Aviation Headsets", "Flight Bags", "Pilot Accessories"] },
      { secondLevel: "Surf", thirdLevel: ["Surf Boards", "Surf Hardware", "Surf Leashes", "Surf Wax", "Surfboard Bags", "Surfboard Fins"] },
    ],
  };

  // Function to handle a top level category click and display its subcategories
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setSubcategories(categoriesData[categoryName] || []);
  };

  // Function to handle a search for the selected category / subcategory
  const handleSearch = async (query, type) => {
    setLoadingMessage(`Searching ${type === 'subcategory' ? query : selectedCategory}...`); // Set the loading message
    setLoading(true); // Show the loading animation

    try {
      const country = localStorage.getItem('selectedCountry'); 

      const response = await axios.get(`${searchApiUrl}?query=${encodeURIComponent(query)}&country=${encodeURIComponent(country)}`); // Make an API request to search for the selected category or subcategory
      setLoading(false); // Stop the loading animation
      
      const { searchResults, priceRanges: fetchedPriceRanges } = response.data;

      navigate('/search', { state: { searchResults: searchResults, query ,priceRanges: fetchedPriceRanges} }); // Navigate to the search page with the search results
    } catch (error) {
      console.error('Error fetching category products:', error); // Log any errors
      setLoading(false); // Stop the loading animation
    }
  };

  return (
    <div className="category-page-wrapper">
      {loading && <Loading message={loadingMessage} />} {/* Show loading spinner and message if loading */}
      
      <div className="category-page"></div>
      {/* Page title and subtitle */}
      <MainHeadTitle 
        title="Browse your favorite Categories"
        subtitle="Browse & compare products from your favorite categories"
      />
      
      {/* Top-Level Categories Section */}
      <div className="top-level-categories">
        {/* Each category has an icon and a click handler to load its subcategories */}
        <div className="top-level-category" onClick={() => handleCategoryClick("Phones")}>
          <i className="fas fa-mobile-alt category-icon"></i>
          <span className="category-name">Phones</span>
        </div>
        <div className="top-level-category" onClick={() => handleCategoryClick("Cameras")}>
          <i className="fas fa-camera category-icon"></i>
          <span className="category-name">Cameras</span>
        </div>
        <div className="top-level-category" onClick={() => handleCategoryClick("Computers")}>
          <i className="fas fa-desktop category-icon"></i>
          <span className="category-name">Computers</span>
        </div>
        <div className="top-level-category" onClick={() => handleCategoryClick("Appliances")}>
          <i className="fas fa-blender category-icon"></i>
          <span className="category-name">Appliances</span>
        </div>
        <div className="top-level-category" onClick={() => handleCategoryClick("Small Appliances")}>
          <i className="fas fa-blender category-icon"></i>
          <span className="category-name">Small Appliances</span>
        </div>
        <div className="top-level-category" onClick={() => handleCategoryClick("Sound")}>
          <i className="fas fa-headphones-alt category-icon"></i>
          <span className="category-name">Sound</span>
        </div>
        <div className="top-level-category" onClick={() => handleCategoryClick("Vision")}>
          <i className="fas fa-tv category-icon"></i>
          <span className="category-name">Vision</span>
        </div>
        <div className="top-level-category" onClick={() => handleCategoryClick("Automotive")}>
          <i className="fas fa-car category-icon"></i>
          <span className="category-name">Automotive</span>
        </div>
        <div className="top-level-category" onClick={() => handleCategoryClick("Clothing & Fashion")}>
          <i className="fas fa-tshirt category-icon"></i>
          <span className="category-name">Clothing & Fashion</span>
        </div>
        <div className="top-level-category" onClick={() => handleCategoryClick("Components")}>
          <i className="fas fa-microchip category-icon"></i>
          <span className="category-name">Components</span>
        </div>
        <div className="top-level-category" onClick={() => handleCategoryClick("Games & Consoles")}>
          <i className="fas fa-gamepad category-icon"></i>
          <span className="category-name">Games & Consoles</span>
        </div>
        <div className="top-level-category" onClick={() => handleCategoryClick("Gifts & Flowers")}>
          <i className="fas fa-gift category-icon"></i>
          <span className="category-name">Gifts & Flowers</span>
        </div>
        <div className="top-level-category" onClick={() => handleCategoryClick("Health & Beauty")}>
          <i className="fas fa-heart category-icon"></i>
          <span className="category-name">Health & Beauty</span>
        </div>
        <div className="top-level-category" onClick={() => handleCategoryClick("Home & Garden")}>
          <i className="fas fa-home category-icon"></i>
          <span className="category-name">Home & Garden</span>
        </div>
        <div className="top-level-category" onClick={() => handleCategoryClick("Kids & Family")}>
          <i className="fas fa-child category-icon"></i>
          <span className="category-name">Kids & Family</span>
        </div>
        <div className="top-level-category" onClick={() => handleCategoryClick("Office Products")}>
          <i className="fas fa-briefcase category-icon"></i>
          <span className="category-name">Office Products</span>
        </div>
        <div className="top-level-category" onClick={() => handleCategoryClick("Sports & Outdoors")}>
          <i className="fas fa-basketball-ball category-icon"></i>
          <span className="category-name">Sports & Outdoors</span>
        </div>
      </div>
      
      {/* Subcategories Section - Only display if a top-level category is selected */}
      {selectedCategory && (
        <div className="subcategories-section">
          {/* Subcategory header */}
          <div className="subcategories-header">
            <h2><a href="#" className="subcategory-link-heading" onClick={() => handleSearch(selectedCategory, 'category')} style={{ textDecoration: 'none', color: 'black' }} >{selectedCategory}</a></h2>
            <a href="#" className="view-all-link" onClick={() => handleSearch(selectedCategory, 'category')}>View All &rarr;</a>
          </div>

          {/* Subcategory columns */}
          <div className="subcategories-columns">
            {subcategories.map((subcategory, index) => (
              <div className="subcategories-column" key={index}>
              <h3><a href="#" className="third-level-category-link-heading" onClick={() => handleSearch(subcategory.secondLevel, 'subcategory')} >{subcategory.secondLevel}</a></h3>
                <ul>
                  {subcategory.thirdLevel.map((thirdLevelCategory, i) => (
                    <li key={i}><a href="#" onClick={() => handleSearch(thirdLevelCategory, 'subcategory')}>{thirdLevelCategory}</a></li>
                  ))}
                  <li><a href="#" onClick={() => handleSearch(subcategory.secondLevel, 'subcategory')}>View all</a></li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryPage;
