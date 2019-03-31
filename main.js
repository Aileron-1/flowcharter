/*function drawArrows(arrows) {
    // call again next time we can draw
    requestAnimationFrame(drawArrows);
    // clear canvas
    ctx.clearRect(0, 0, cvWidth, cvHeight);
    // draw everything
    everyObject.forEach(function(o) {
    ctx.fillStyle = o[4];
    ctx.fillRect(o[0], o[1], o[2], o[3]);
    });
    // 
    ctx.fillStyle = '#000';
    ctx.fillText('click to add random rects', 10, 10);
}*/


function createActivity (x, y, dataObject, dataID) {
    var activity = {}//dataObject;
    activity.id = dataID
    activity.data = dataObject;
    activity.attributeTextOrder = ["stage","substage","workflow","platform","assistant","genre","description"];
    activity.attributeLabels = ["Stage","Substage","Workflow","Platform","Assistant","Genre","Description"];  // 
    activity.bodyLineHeight = canvas.bodyFontStyle.size+2;
    /*activity.bottomPadding = 20;
    activity.rightPadding = 20;*/
    
    //activity.box = // This is the element to be created
                // create it in here? seems to be fine and also saves space
    activity.drawChildArrows = function (ctx) {
        for (var i = 0; i < this.data.children.length; i++) {
            //var childTop = 
            console.log(this.box.position().top)
            drawArrowTo(ctx, 100+(this.id*10), 200, 0,0);
        }
    };
    
    return activity;
}

function activityToDiv (activity, chart) {
    var data = activity.data;
    var parentElement = activity.data;
    var attributeTextOrder = activity.attributeTextOrder;
    
    // Create element
    $('<div class="data"></div>').appendTo(chart);
    var elementData = $('.data:last');
    elementData.css({top: 0, left: 0});
    
    // Create box
    $('<div class="data-box"></div>').appendTo('.data:last');
    var elementBox = $('.data-box:last');
    
    // Append title
    var textToAppend = data.title;
    $('<div class="data-box-title">'+textToAppend+'</div>').appendTo(elementBox);
    
    // Append attributes 
    for (var i = 0; i < attributeTextOrder.length; i++) {
        var textToAppend = data[attributeTextOrder[i]];
        $('<div class="data-box-attribute">'+textToAppend+'</div>').appendTo(elementBox);
    }
    
    // Create div for children 
    $('<div class="data-children"></div>').appendTo('.data:last');
    
    return elementData;
}

function moveElementTo (element, x, y, duration) {
    var wOffset = element.width()/2;
    $(element).animate({'top':y+'px', 'left':(x-wOffset)+'px'}, duration, function(){
    });
}

function createArrow(owner, target) {
    var arrow = {};
    arrow.owner = owner;
    arrow.target = target;
    
    return arrow;
}

function drawArrowTo (ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// Convert the raw data into 2 maps: data and relationships. 
// Data contains data such as it's unique ID, title, description and the position of the element. 
// Relationships contain the "arrows", using the unique ID of each element as the pointer 
// Then, place the 

// Prep canvas
var c = document.getElementById("flowchart");
var ctx = c.getContext("2d");
var canvas = {
    ctx: ctx,
    origin: {
        x: c.width/2,
        y: 30
    },
    titleFontStyle: {
        size: 18,
        font: "Calibri Bold"
    },
    bodyFontStyle: {
        size: 16,
        font: "Calibri"
    },
};
                                var bottomPadding = 100;
                                //var topPadding = 100;
                                
// Initialize children
var workingData = inputData();
for (var i = 0; i < workingData.length; i++) {
    workingData[i].children = [];
}

// Find children and add them to the respective parent activities.
for (var i = 0; i < workingData.length; i++) {
    var current = workingData[i]
    for (var o = 0; o < current.parent.length; o++) {
        workingData[current.parent[o]].children.push(i);
    }
}

// Pushing first one, then push it's children, and continuing until no children are left..
var toPush = [0];
var toPushNext = [];
var pushed = [];
var activities = [[]];
var activity;
var count = 0;
for (var u = 0; u < workingData.length; u++) {
    for (var i = 0; i < toPush.length; i++) {
        activity = workingData[toPush[i]];
        activities[u].push(createActivity( 0, 0, activity, count));
        // Take its children, but not if we've already took it
        for (var o = 0; o < activity.children.length; o++) {
            if (pushed.includes(activity.children[o]) == false) {
                toPushNext.push(activity.children[o]);
                pushed.push(activity.children[o]);
            }
        }
        count++;
    }
    if (toPushNext.length != 0) { activities.push([]); }
    toPush = toPushNext;
    toPushNext = [];

}
console.log(activities)

// Create the activities
var offsetHeight = 0;
var midpoint = $('.chart').width()/2; // ****************** midpoint of parent
for (var i = 0; i < activities.length; i++) {
    var level = activities[i]; 
    
    $('.chart').append('<div class="chart-level"></div>')
    for (var o = 0; o < level.length; o++) {
        var activity = activities[i][o];
        var levelElement = $('.chart-level:last');
        
        
        var e = activityToDiv(activity, levelElement);
        activities[i][o].box = e;
        
        
        
        
        // gen midpoint of parent (middle of canvas if no parent)
        // have something for 2 and more parents 
        if (activities[i][o].data.parent.length == 1) {
            var p = activities[i][o].data.parent[0];
            //midpoint = p.box.outerWidth()/2;
        }
        var orderHorizontalOffset = o*(e.outerWidth()+20);
        var middingOffset = ((level.length-1)*(e.outerWidth()+20))/2;
        moveElementTo(e, midpoint+orderHorizontalOffset-middingOffset,offsetHeight+20,250);
        
        
    }
        
    offsetHeight += e.outerHeight()+20;
}

// Create arrows, 1st pass



// Update canvas height
c.height = offsetHeight+bottomPadding;


// Animation loop
//drawArrows();














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
