import { inputData } from './data.js';

// Customize these properties when changing the input data.
var flowchartSettings = {
    dataAttributeOrder: ["stage","substage","workflow","platform","assistant","genre","description"],  // Property names you want to display
    dataAttributeLabels: ["Stage","Substage","Workflow","Platform","Assistant","Genre","Description"],  // The text displayed with each property
    dataTitleKey: "title"  // Key in object for use as title 
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
    div.append(activityDiv);
    if (activity.children.length > 1) {
        $('.flowchart-activity-children:last').addClass('multiple');
    }
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
    $('#test').append('<p>Test</p>')
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
        relationship.y1 = from.y + from.height + 20 - 4;
        relationship.x2 = to.x + to.width/2 + 20;
        relationship.y2 = to.y + 20 - 4;
        
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

