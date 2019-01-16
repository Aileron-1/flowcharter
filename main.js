/*function drawText(ctx, x, y, text, fontStyle) {
    ctx.font = fontStyle.size + "px " + fontStyle.font;
    ctx.textAlign = "left";
    ctx.fillText(text, x, y);
}*/

function createActivity(canvas, x, y, dataObject) {
    var activity = dataObject;
    activity.data = dataObject;
    activity.attributeTextOrder = ["stage","substage","workflow","platform","assistant","genre","description"];
    activity.attributeLabels = ["Stage","Substage","Workflow","Platform","Assistant","Genre","Description"];
    activity.x = x;
    activity.y = y;
    activity.box = {
        "w": 300, 
        "h": 0, // should be responsive? possibly unused
    }
    activity.bodyLineHeight = canvas.bodyFontStyle.size+2
    activity.bottomPadding = 20;
    activity.height = function () {
        var lineAmount = this.attributeTextOrder.length+1;
        var height = canvas.titleFontStyle.size+(this.bodyLineHeight*1.5)+this.bodyLineHeight*lineAmount + this.bottomPadding;
        return height;
    }
    
    return activity;
}

function drawActivity(canvas, x, y, activity) {
    var ctx = canvas.ctx;
    var data = activity.data;
    
    // Draw box 
    ctx.rect(x, y, activity.box.w, activity.height());
    ctx.stroke();
    
    // Draw title
    var s = data.title;
    ctx.font = canvas.titleFontStyle.size+"px "+canvas.titleFontStyle.font;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(s, x+18, y+18);
    //var lineOffset = canvas.titleFontStyle.size;
    
    // Draw attributes
    var attributeTextOrder = activity.attributeTextOrder;
    var attributeLabels = activity.attributeLabels;
    var bodyLineHeight = activity.bodyLineHeight;
    var outputText = "";
    for (var i = 0; i < attributeTextOrder.length; i++) {
        outputText = attributeLabels[i]+": "+data[attributeTextOrder[i]];
        ctx.font = canvas.bodyFontStyle.size+"px "+canvas.bodyFontStyle.font;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        wrapText(ctx, outputText, x+18, y+canvas.titleFontStyle.size+(bodyLineHeight*1.5)+bodyLineHeight*i, activity.box.w-20, bodyLineHeight);  //outputText, x+18, y+canvas.titleFontStyle.size+(bodyLineHeight)*(i+2), activity.box.w, bodyLineHeight);
    }
    
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {  // Adapted from https://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
    var words = text.split(' ');
    var line = '';
    
    for(var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}


// Create "levels based on the data (into a more displayable structure)
// OR sort each data by shared parents. Create divs based on these "levels" and populate the divs with the respective data. Afterward, draw arrows for each. If it works.

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
for (var u = 0; u < workingData.length; u++) {
    for (var i = 0; i < toPush.length; i++) {
        activity = workingData[toPush[i]];
        activities[u].push(createActivity(canvas, 0, 0, activity));
        // Take its children, but not if we've already took it
        for (var o = 0; o < activity.children.length; o++) {
            if (pushed.includes(activity.children[o]) == false) {
                toPushNext.push(activity.children[o]);
                pushed.push(activity.children[o]);
            }
        }
    }
    if (toPushNext.length != 0) { activities.push([]); }
    toPush = toPushNext;
    toPushNext = [];

}
        
                                var bottomMargins = 100;
                                var topPadding = 100;



// Get heights of each activity and return sum, and change canvas height.
var totalHeight = 0+topPadding;
for (var i = 0; i < activities.length; i++) {
    var level = activities[i]; 
    for (var o = 0; o < level.length; o++) {
        var activity = activities[i][o];
        totalHeight += activity.height();
    }
}
c.height = totalHeight;

// Loop would be from here
// Position the activities

// Draw the activities
for (var i = 0; i < activities.length; i++) {
    var level = activities[i]; 
    for (var o = 0; o < level.length; o++) {
        var activity = activities[i][o];
        var midOffset_w = activity.box.w/2;
        var midOffset_h = activity.height()/2;
        activity.x = canvas.origin.x+350*o - midOffset_w - (350-(350/level.length)); 
        activity.y = canvas.origin.y+(activity.height()+bottomMargins)*i + topPadding - midOffset_h;
        
        var activity = activities[i][o];
        drawActivity(canvas, activity.x, activity.y, activity);
        
    }
}

// Draw arrows, 1st pass




















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
    ];
    return data;
}
