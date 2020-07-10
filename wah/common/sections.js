
///// Section Class Definition & Instances /////
var Section = function(stepNumber, note, angleX, angleY, mediaPath, infoPointData, fadeAtVideoEnd, fadeAtImageEnd, title, audio, infoPointCountText, enableVideoSkip, hasAltView, altViewAudio, teleportTime) {
    this.stepNumber = stepNumber; // button number in left hand UI
    this.note = note; // accompanying note
    this.angleX = angleX; // camera starting position for x
    this.angleY = angleY; // camera starting position for y
    this.mediaPath = mediaPath; // path to cubemaps, video and static image
    this.resetEyepoint = false;
    this.visited=false;
    this.infoPointData = infoPointData;
    this.fadeAtVideoEnd = fadeAtVideoEnd;
    this.fadeAtImageEnd = fadeAtImageEnd;
    this.title = title;
    this.audio = audio;
    this.infoPointCountText = infoPointCountText;
    this.enableVideoSkip = enableVideoSkip;
    this.hasAltView = hasAltView;
    this.altViewAudio = altViewAudio;
    this.teleportTime = teleportTime;
};

var InfoPoint = function(title, text, angleX, angleY, isHazard, loadAltView) {
    this.title = title;
    this.text = text; // accompanying note
    this.angleX = angleX; // camera starting position for x
    this.angleY = angleY; // camera starting position for y
    this.isHazard = isHazard;
    this.loadAltView = loadAltView;
};

var prepInfoPoints = [new InfoPoint("Harness", "A four-point harness, in good working order, is the only way to stay safely secured to structures via ropes, cables and lanyards when all other measures of fall prevention have been ruled out.", -10.0, -85.0, false, false),
    new InfoPoint("Rescue Kit", "A rescue kit is imperative in the event that you or your teammate get into difficulty, stuck, or fall suspended by harness and lanyard when working at height.", 30.0, -24.0, false, false),
    new InfoPoint("Twin Lanyards", "Twin lanyards are used to remain safely 'tied on' when working at height where a Fall Arrest System is not present or cannot be relied on for safe access to every necessary part of the working area.", -10.0, -10.0, false, false),
    new InfoPoint("Tool Tether", "Even small tools dropped from height can cause serious or fatal injuries to those below. Wherever possible, tools should be tethered to whoever is using them, or a suitable anchor on the structure itself.", 12.0, 0.0, false, false),
    new InfoPoint("Footwear", "Good, sturdy work boots with steel-reinforced toe caps are the only appropriate footwear for working at height, whatever the site.", 5.0, 22.0, false, false),
    new InfoPoint("Climbing Helmet", "Climbing helmets are designed to protect the head while climbing and working at height, maximising visibility by remaining in position when looking up or down.", -8.0, -33.0, false, false),
    new InfoPoint("Tools", "Different tasks require different tools. It is not wise to take many more tools than you need when working at height, so think ahead.", 24.0, 26.0, false, false),
    new InfoPoint("FAS Connector", "A Fall Arrest System (FAS) allows for faster climbing without sacrificing safety. Connectors are used to securely attach your harness to the cables of a Fall Arrest System.", -10.0, -22.0, false, false),
    new InfoPoint("Hardhat", "Hardhats are necessary on sites of all kinds, but are not suitable head protection for climbing or working at height.", -20.0, 28.0, false, false),
    new InfoPoint("Eyewear", "Where eye protection is required, sunglasses rarely provide the appropriate level of protection. Safety should always come before style.", 29.0, 7.0, false, false)];
         
var hazard1InfoPoints = [new InfoPoint("Exposed Edge", "There is a serious risk of a life-threatening fall where the wall is damaged. Roof edges higher than 2m should be protected by a guardrail or wall at least 95cm high.", 5.0, 70.0, true, true)];

var hazard2InfoPoints = [new InfoPoint("Slip Hazard", "The fluid leaking from this rooftop grease trap presents a serious slip hazard. It should be reported to the building manager to be cleaned up as soon as possible.", 35.0, -67.0, true, false),
    new InfoPoint("Fragile Roof Hazard", "Access to fragile roof surfaces such as skylight windows should be blocked by a guardrail at least 95cm high. Working unsecured within 2m of such a hazard presents a serious risk.", 10.0, 30.0, true, true)];

var hazard3InfoPoints = [new InfoPoint("FAS Inspection Date", "Fall Arrest Systems must be inspected annually to ensure they are fit for purpose. The safety of a FAS inspected more than a year ago cannot be guaranteed and so should not be used.", 50.0, 90.0, true, false),
    new InfoPoint("Bird Droppings", "A range of unpleasant diseases can be transmitted via bird droppings, including histoplasmosis. Avoid skin contact by wearing gloves and other appropriate clothing while working at height.", 8.0, 39.0, true, false)];

var procedureInfoPoints = [new InfoPoint("Safely Secured", "You should always be securely tethered to the structure via at least one sufficient anchor point. Twin lanyards allow for movement by detaching and reattaching one connection at a time.", 13.0, -44.0, false, false),
    new InfoPoint("Falling Objects", "Wherever possible, parts and tools used to carry out repairs at height should be contained and secured to the structure or tethered to you to prevent them falling and causing serious injury to those below.", 10.0, 5.0, false, false),
    new InfoPoint("Adverse Weather", "Keep an eye on the weather when working outside. Strong wind, rain and lightning storms can pose serious risks to those working at height. If in doubt, don't climb.", -24.0, -34.0, false, false)];



var intro = new Section(
    1,
    "",
    0,
    0,
    "Content/sequences/intro/",
    [],
    true,
    false,
    "Intro",
    null,
    "",
    false,
    false,
    "",
    31
);

var prep = new Section(
    2,
    "Select each inspection icon to review the equipment required to ensure the job can be carried out safely.",
    0,
    0,
    "Content/sequences/prep/",
    prepInfoPoints,
    true,
    true,
    "Preparations",
    "Content/Audio/VanOpen.ogg",
    "Equipment inspected: ",
    false,
    false,
    "",
    25
);
var hazard1 = new Section(
    3,
    "Look around the area to identify any hazards.",
    0,
    0,
    "Content/sequences/hazard1/",
    hazard1InfoPoints,
    false,
    true,
    "Risk Assessment",
    null,
    "Hazards identified: ",
    false,
    true,
    "Content/Audio/RipTape.ogg",
    0
    );
var hazard2 = new Section(
    4,
    "Look around the area to identify any hazards.",
    0,
    0,
    "Content/sequences/hazard2/",
    hazard2InfoPoints,
    false,
    true,
    "Risk Assessment",
    null,
    "Hazards identified: ",
    false,
    true,
    "Content/Audio/RipTape.ogg",
    0
);
var hazard3 = new Section(
    5,
    "Look around the area to identify any hazards.",
    0,
    0,
    "Content/sequences/hazard3/",
    hazard3InfoPoints,
    true,
    true,
    "Risk Assessment",
    null,
    "Hazards identified: ",
    false,
    false,
    "",
    0
);

var procedure = new Section(
    6,
    "Explore the area around the apparatus requiring repair.",
    15,
    0,
    "Content/sequences/procedure/",
    procedureInfoPoints,
    true,
    true,
    "Working Safely",
    null,
    "Items inspected: ",
    false,
    false,
    "",
    0
);
       
var debrief = new Section(
    7,
    "",
    0,
    0,
    "Content/sequences/debrief/",
    [],
    true,
    true,
    "Fin",
    null,
    "",
    false,
    false,
    "",
    0
);

function getSections() {
    return [intro, prep, hazard1, hazard2, hazard3, procedure, debrief];
}

var sectionsPreLoaded=false;