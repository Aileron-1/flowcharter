/* global $ */

// Customize these properties when changing the input data.
var flowchartSettings = {
    dataAttributeOrder: ["stage","substage","workflow","platform","assistant","genre","description"],  // Property names you want to display
    dataAttributeLabels: ["Stage","Substage","Workflow","Platform","Assistant","Genre","Description"],  // The text displayed with each property
    dataTitleKey: "title"
}
var input = inputData();  // Expects an array of objects that has the properties listed in the settings above.
var activities = [];
var relationships = [];

// Find children and add them to the respective parent activities.
for (var i = 0; i < input.length; i++) {
    input[i].children = [];
}
for (var i=0; i<input.length; i++) {
    var current = input[i]
    for (var o=0; o<current.parent.length; o++) {
        input[current.parent[o]].children.push(i);
    }
}

// Make activity objects
for (let i=0; i<input.length; i++) {
    // create an activity, then add it to the array
    let data = input[i];
    let activity = {};
    activity.x = 0;  // x and y correspond to the top and middle of the activity box 
    activity.y = 0;
    activity.width = 0;
    activity.height = 0;
    activity.div = '';
    activity.id = i;//idIndex;
    activity.title = data[flowchartSettings.dataTitleKey];
    activity.parents = data['parent'];
    activity.children = data['children'];
    activity.relationships = [];
    activity.attributeOrder = flowchartSettings.dataAttributeOrder;
    activity.attributeLabels = flowchartSettings.dataAttributeLabels;
    activity.attributes = {};
    for (let o=0; o<activity.attributeOrder.length; o++) {
        let att = activity.attributeOrder[o];
        activity.attributes[att] = data[att];
    }
    activities.push(activity);
}

// Find relationships and make objects for them 
for (let i=0; i<activities.length; i++) {
    let object = activities[i];
    
    // Make a relationship for each 'parent'
    for (let o=0; o<object.parents.length; o++) {
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










/*

// Create activity divs, in order
var created = [];

// Pushing first one, then push it's children, and continuing until no children are left..
let toPush = [];
let toPushNext = [];
let pushed = [];
let orderedActivities = [[]];
let activity;
// Start with the ones with no parents
for (let i=0; i<activities.length; i++) {
    let activity = activities[i];
    if (activity.parents.length == 0) {
        toPush.push(i);
    }
}
for (let u = 0; u < activities.length; u++) {
    for (let i = 0; i < toPush.length; i++) {
        activity = activities[toPush[i]];
        orderedActivities[u].push(activity);
        // Take its children, but not if we've already took it
        for (let o = 0; o < activity.children.length; o++) {
            if (pushed.includes(activity.children[o]) == false) {
                toPushNext.push(activity.children[o]);
                pushed.push(activity.children[o]);
            }
        }
    }
    if (toPushNext.length != 0) { orderedActivities.push([]); }
    toPush = toPushNext;
    toPushNext = [];

}
console.log(orderedActivities)


// Use ordered list to make the divs in order
for (let i=0; i<orderedActivities.length; i++) {
    for (let o=0; o<orderedActivities[i].length; o++) {
        let activity = orderedActivities[i][o];
        //createActivityDiv(activity.id);
        created.push(activity.id);
    }
}*/




// w
/*var created = [];
for (let i=0; i<activities.length; i++) {
    let activity = activities[i];
    createActivityDiv(activity.id);
    created.push(activity.id);
    
}*/





// Create activity divs, in order
var created = [];
// Start with the ones with no parents
for (let i=0; i<activities.length; i++) {
    let activity = activities[i];
    if (activity.parents.length == 0) {
        createDivAndCheckChild(i);
    }
}

function createDivAndCheckChild (id) {
    if (created.includes(id) == false) {
        let activity = activities[id];
        createActivityDiv(id);
        for (let i=0; i<activity.children.length; i++) {
            createDivAndCheckChild(activity.children[i]);
        }
    }
    created.push(id);
}



function createActivityDiv(id) {
    let activity = activities[id];
    let div = $('#activity-wrapper');
    let activityDiv = '';
    activityDiv += '<div class="flowchart-activity"><div class="flowchart-activity-info">';
    activityDiv += '<h2>'+id+' '+ activity.title +'</h2><ul>';
    for (let o=0; o<activity.attributeOrder.length; o++) {
        activityDiv += '<li>';
        activityDiv += '<span class="flowchart-label">' + activity.attributeLabels[o] + ': </span>';
        activityDiv += activity.attributes[activity.attributeOrder[o]];
        activityDiv += '</li>';
    }
    activityDiv += '</ul></div>';
    activityDiv += '<div class="flowchart-activity-children"></div>';
    activityDiv += '</div>';
    
    if (activity.parents.length > 0) {
        div = activities[activity.parents[0]].div.children('.flowchart-activity-children');
    }
    console.log(id+': '+activity.children.length)
    if (activity.children.length > 1) {
        $('.flowchart-activity:last').addClass('multiple');
    }
    div.append(activityDiv);
    activity.div = $('.flowchart-activity:last');
    
    //$('.flowchart-activity:last').css('order', id);
}


// canvas
const canvas = document.getElementById('chart-canvas');
const ctx = canvas.getContext('2d');

// Update canvas width, height
$(document).ready(function () {
    updateDraw(created);
});

$('#testbutton').click(function() {
    $('#test').append('<p>Testsa</p>')
});

// Update each activity's height based on internal elements
function updateDraw (created) {
    // Update canvas size
    canvas.height = $('#activity-wrapper').height();
    canvas.width = $('#activity-wrapper').width();
    
    // Update and draw each activity and relationship's position
    for (let i=0; i<created.length; i++) {
        let activity = activities[created[i]];
        let divToPointTo = activity.div.children('.flowchart-activity-info');
        let activityPos = divToPointTo.position();
        
        activity.x = activityPos.left;
        activity.y = activityPos.top;
        
        activity.width = divToPointTo.outerWidth();
        activity.height = divToPointTo.outerHeight();
        
        
    }
    
    /*
    for (let i=0; i<orderedActivities.length; i++) {
        for (let o=0; o<orderedActivities[i].length; o++) {
            let activity = orderedActivities[i][o];
            //createActivityDiv(activity.id);
            created.push(activity.id);
        }
    }*/
    
    for (let i=0; i<relationships.length; i++) {
        let relationship = relationships[i];
        let from = activities[relationship.from];
        let to = activities[relationship.to];
        
        relationship.x1 = from.x + from.width/2 + 20;
        relationship.y1 = from.y + from.height + 20;
        relationship.x2 = to.x + to.width/2 + 20;
        relationship.y2 = to.y + 20;
        
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(relationship.x1,relationship.y1+3);
        ctx.lineTo(relationship.x2,relationship.y2-3);
        ctx.stroke();
        
        ctx.fillRect(relationship.x2-4,relationship.y2-8,8,8);
        ctx.fillRect(relationship.x1-4,relationship.y1,8,8);
    }
    requestAnimationFrame(updateDraw);
}







function moveElementTo (element, x, y, duration) {
    var wOffset = element.width()/2;
    $(element).animate({'top':y+'px', 'left':(x-wOffset)+'px'}, duration, function(){
    });
}










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
            "parent":[17]
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
            "parent":[18]
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
            "parent":[19]
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
            "parent":[20]
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
            "parent":[21]
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
            "parent":[22]
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
            "parent":[22]
        } //25th
        
    ];
    return data;
}
