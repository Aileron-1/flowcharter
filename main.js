//import data from './data.js';

// Customize these properties when changing the input data.
var flowchartProperties = {
    dataAttibuteOrder: ["stage","substage","workflow","platform","assistant","genre","description"],  // Property names you want to display
    dataAttributeLabels: ["Stage","Substage","Workflow","Platform","Assistant","Genre","Description"],  // The text displayed with each property
    dataWidth: 150  // width of box in pixels
}

var input = inputData();//data.inputData();
var activities = [];
var relationships = [];

// Make activity objects
let idIndex = 0; 
for (var i=0; i<input.length; i++) {
    // create an activity, then add it to the array
    let activity = {};
    let data = input[i];
    
    activity.id = idIndex;
    activity.x = 0;
    activity.y = 0;
    activity.parents = data['parent'];
    activity.title = data['title'];
    activity.attibuteOrder = flowchartProperties.dataAttibuteOrder;
    activity.attributeLabels = flowchartProperties.dataAttributeLabels;
    activity.attributes = {};
    for (var o=0; o<activity.attibuteOrder.length; o++) {
        let att = activity.attibuteOrder[o];
        //let attStr = activity.attributeLabels[o];
        activity.attributes[att] = data[att];
    }
    
    activities.push(activity);
    idIndex += 1;
}
console.log(activities);

// Find relationships and make objects for them 
for (var i=0; i<activities.length; i++) {
    let object = activities[i];
    
    // Make a relationship for each 'parent'
    for (var o=0; o<object.parents.length; o++) {
        let relationship = {};
        relationship.from = object.parents[o];
        relationship.to = object.id;
        relationship.x1 = 0;
        relationship.y1 = 0;
        relationship.x2 = 0;
        relationship.y2 = 0;
        relationships.push(relationship);
    }
}
console.log(relationships);



// Order activities


// Display activities





// canvas
const canvas = document.getElementById('flowchart');
const ctx = canvas.getContext('2d');
var panX = 0;
var panY = 0;

let gap = 80;

canvas.height = activities.length*gap + 100;

// Loop through each activity and relationship. Update its position
for (var i=0; i<activities.length; i++) {
    let activity = activities[i];
    
    activity.x = 100+Math.random()*500 + panX;
    activity.y = 25 + i*gap + panY;
}

for (var i=0; i<relationships.length; i++) {
    let relationship = relationships[i];
    let from = activities[relationship.from];
    let to = activities[relationship.to];
    
    relationship.x1 = from.x;
    relationship.y1 = from.y;
    relationship.x2 = to.x;
    relationship.y2 = to.y;
}
    

                // update relationship xxyy
                // Draw all the objects and link them



for (var i=0; i<activities.length; i++) {
    let activity = activities[i];
    ctx.font = '24px fantasy';
    ctx.fillText(activity.title, activity.x+panX, activity.y+panY);
}

for (var i=0; i<relationships.length; i++) {
    let relationship = relationships[i];
    
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(relationship.x1,relationship.y1);
    ctx.lineTo(relationship.x2,relationship.y2);
    ctx.stroke();
}



// X = average of parents' X.  (different if root/no parent)
// Y = largest of parents Y + spacing













function inputData() {
    var data=[
        {
            "stage":"post",
            "substage":"prep",
            "workflow":"Smash",
            "platform":["Avid"],
            "assistant":true,
            "genre":"feature",
            "title":"Wrangling",
            "description":"Copy synced dailies from Technicolor HDD to Unity.",
            "parent":[]
        },
        {
            "stage":"post",
            "substage":"prep",
            "workflow":["Smash","freelance"],
            "platform":["Premiere","Avid"],
            "assistant":true,
            "genre":"feature",
            "title":"Subclipping",
            "description":"Create subclips with only the stereo mix.",
            "parent":[0]
        },
        {
            "stage":"post",
            "substage":"prep",
            "workflow":["Smash","freelance"],
            "platform":["Premiere","Avid"],
            "assistant":true,
            "genre":["feature","short","music","doco","tv","social"],
            "title":"Logging",
            "description":"Write Description of all clips.",
            "parent":[1]
        },
        {
            "stage":"post",
            "substage":"prep",
            "workflow":["freelance"],
            "platform":"FCPX",
            "assistant":true,
            "genre":["feature","short","music","doco","tv","social"],
            "title":"Keywording",
            "description":"Organise clips into keywords",
            "parent":[1]
        },
        {
            "stage":"post",
            "substage":"prep",
            "workflow":"Smash",
            "platform":["Premiere","Avid"],
            "assistant":true,
            "genre":["feature","short","music","doco","tv","social"],
            "title":"Markers",
            "description":"Put green markers for Action.",
            "parent":[2]
        },
        {
            "stage":"post",
            "substage":"prep",
            "workflow":"Smash",
            "platform":["FCPX"],
            "assistant":true,
            "genre":["feature","short","music","doco","tv","social"],
            "title":"Markers",
            "description":"Put markers for Action.",
            "parent":[3]
        },
        {
            "stage":"post",
            "substage":"prep",
            "workflow":"freelance",
            "platform":["Premiere","Avid","FCPX"],
            "assistant":false,
            "genre":["feature","short","music","doco","tv","social"],
            "title":"Assembly",
            "description":"Do rough assembly according to circle takes. Provide feedback if something's missing.",
            "parent":[4,5]
        },
        {
            "stage":"post",
            "substage":"prep",
            "workflow":"freelance",
            "platform":["Premiere","Avid","FCPX"],
            "assistant":false,
            "genre":["feature","short","doco","tv","social"],
            "title":"Assembly",
            "description":"Try to use every shot in rough assembly, but provide alternative cut if time allows. ASSEMBLY MUST FOLLOW SCRIPT.",
            "parent":[6]
        },
        {
            "stage":"post",
            "substage":"cut",
            "workflow":"freelance",
            "platform":["Premiere","Avid","FCPX"],
            "assistant":false,
            "genre":["feature","short","music","doco","tv","social"],
            "title":"Director's Cut",
            "description":"Back and forth process with the director finding his cut.",
            "parent":[7]
        },
        {
            "stage":"post",
            "substage":"cut",
            "workflow":"freelance",
            "platform":["Premiere","Avid","FCPX"],
            "assistant":true,
            "genre":["feature","short","music","doco","tv","social"],
            "title":"Temp Effects",
            "description":"Apply temp grade, temp sound, temp music and temp effect.",
            "parent":[8]
        },
        {
            "stage":"post",
            "substage":"handover",
            "workflow":"freelance",
            "platform":["Premiere","Avid","FCPX"],
            "assistant":true,
            "genre":["feature","short","music","doco","tv","social"],
            "title":"Picture Lock",
            "description":"Duplicate timeline and remove all disabled clips, and minimize the number of tracks",
            "parent":[9]  // this is 10
        },
        {
            "stage":"post",
            "substage":"handover",
            "workflow":"freelance",
            "platform":["Premiere"],
            "assistant":true,
            "genre":["feature","short","music","doco","tv","social"],
            "title":"Audio Handover",
            "description":"Keep multicam clips audio, delete all picture & export AAF with audio in a folder.",
            "parent":[10]
        },
        {
            "stage":"post",
            "substage":"handover",
            "workflow":"freelance",
            "platform":["FCPX"],
            "assistant":true,
            "genre":["feature","short","music","doco","tv","social"],
            "title":"Assign Roles",
            "description":"Check every clips on the timeline for their correct roles.",
            "parent":[10]
        },
        {
            "stage":"post",
            "substage":"handover",
            "workflow":"freelance",
            "platform":["Premiere"],
            "assistant":true,
            "genre":["feature","short","music","doco","tv","social"],
            "title":"Flatten Multicam",
            "description":"Flatten multicam clips, delete all sound & export xml.",
            "parent":[11]
        },
        {
            "stage":"post",
            "substage":"handover",
            "workflow":"freelance",
            "platform":["FCPX"],
            "assistant":true,
            "genre":["feature","short","music","doco","tv","social"],
            "title":"Colourist Handover",
            "description":"Export FCPXML and also convert FCPXML to EDL with EDL-X.",
            "parent":[12]
        },
        {
            "stage":"post",
            "substage":"handover",
            "workflow":"freelance",
            "platform":["FCPX"],
            "assistant":true,
            "genre":["feature","short","music","doco","tv","social"],
            "title":"Logic Pro Handover",
            "description":"Export FCPXML.",
            "parent":[14]
        },
        {
            "stage":"post",
            "substage":"handover",
            "workflow":"freelance",
            "platform":["FCPX"],
            "assistant":true,
            "genre":["feature","short","music","doco","tv","social"],
            "title":"Pro Tools Handover",
            "description":"Export FCPXML and use X2Pro.",
            "parent":[14]
        },
        {
            "stage":"post",
            "substage":"prep",
            "workflow":"hsquared",
            "platform":["Premiere"],
            "assistant":true,
            "genre":["social","tv"],
            "title":"Wrangling",
            "description":"Create folder according to show acronyms (e.g. GCBC11 or EG8) and shoot day (referring to shoot notes) e.g. GCBC11_ShootDay31, and create folder within for each camera and each recipe (e.g. GCBC11_ShootDay31_01_CamA). Copy media to server plus 2 local drives. ",
            "parent":[]
        },
        {
            "stage":"post",
            "substage":"prep",
            "workflow":"hsquared",
            "platform":["Premiere"],
            "assistant":true,
            "genre":["social","tv"],
            "title":"Sync",
            "description":"Sync with Pluraleyes by media on local drive (sync from server might cause error). Import the resulting xml into premiere with name of recipie (e.g. GCBC11_ShootDay31_01_Chicken and Leek Pie.prproj) avoid symbols. Relink to server media and make 2 copies of the Premiere Project onto the 2 local drives.",
            "parent":[18]
        },
        {
            "stage":"post",
            "substage":"prep",
            "workflow":"hsquared",
            "platform":["Premiere"],
            "assistant":true,
            "genre":["social","tv"],
            "title":"Format Cards",
            "description":"Note in shoot note that files is synced. Put card content in trash and empty trash. Put card in wrangle outbox.",
            "parent":[19]
        },
        {
            "stage":"post",
            "substage":"cut",
            "workflow":"hsquared",
            "platform":["Premiere"],
            "assistant":false,
            "genre":["social"],
            "title":"Review Edit",
            "description":"Review with Jazz before export.",
            "parent":[20]
        },
        {
            "stage":"post",
            "substage":"cut",
            "workflow":"hsquared",
            "platform":["Premiere"],
            "assistant":false,
            "genre":["social"],
            "title":"Editing Projects",
            "description":"Put editor's initials at the end of the shot project (e.g. GCBC11_Day31_02_Dish_KL.prproj.) Copy shot project onto desktop for editing, and move it back to server at the end of each day. Sequence naming convetion: GCBC11_Day31_02_Dish_KL_Edit01",
            "parent":[21]
        },
        {
            "stage":"post",
            "substage":"cut",
            "workflow":"hsquared",
            "platform":["Premiere"],
            "assistant":false,
            "genre":["social"],
            "title":"Vimeo Review",
            "description":"Upload to Vimeo with password of the show acronym or 'Mission' or '10' for 10Daily",
            "parent":[22]
        },
        {
            "stage":"post",
            "substage":"mastering",
            "workflow":"hsquared",
            "platform":["Premiere"],
            "assistant":true,
            "genre":["social","tv"],
            "title":"Mastering",
            "description":"Move all bins into Edit_Project Assets bin, duplicate sequence into project root with naming format GCBC11_Day31_02_Dish_MASTER.prproj",
            "parent":[23]
        },
        {
            "stage":"post",
            "substage":"mastering",
            "workflow":"hsquared",
            "platform":["Premiere"],
            "assistant":true,
            "genre":["tv"],
            "title":"International Mastering",
            "description":"Remove all product B-cam shots, remove verbal mentions, remove advertising segments. Check slate, slate timing. Create textless segments at the end of the sequence, without bars and tones, with at least 2 seconds gap between textless clips, and with handles until next/previous cut.",
            "parent":[23]
        } //25th
        , // test
        {
            "stage":"TEST 3",
            "substage":"mastering",
            "workflow":"hsquared",
            "platform":["Premiere"],
            "assistant":true,
            "genre":["tv"],
            "title":"Test",
            "description":"Remove all product B-cam shots, remove verbal mentions, remove advertising segments. Check slate, slate timing. Create textless segments at the end of the sequence, without bars and tones, with at least 2 seconds gap between textless clips, and with handles until next/previous cut.",
            "parent":[3]
        }
    ];
    return data;
}
