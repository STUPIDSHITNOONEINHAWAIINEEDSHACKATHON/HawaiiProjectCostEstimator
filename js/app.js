project = new Object();

projectWeights = {
  type: {
    new: 1,
    existing: 3
  },

  design: {
    none: 1,
    css: 2,
    scss: 3,
    framework: 5
  },

  testing: {
    none: 1.5,
    basic: 1.5,
    thorough: 2,
    overthorough: 7
  },

  devops: {
    none: 15000,
    basic: 10000,
    thorough: 50000
  }

}

function updateProjectValues() {
  project.values = new Object();
  var formData = document.forms[0];

  // project type
  project.values.projectType =
    projectWeights.type[formData.projectType.value]; 
  
  // design
  project.values.design =
    projectWeights.design[formData.design.value]; 
  
  project.values["design-responsive"] = formData.responsive.checked;

  project.values.milestoneCount = formData.milestones.value;

  project.values.milestones = new Object();
  project.values.milestones.num = 
    formData.milestoneTimeVal.value;
  project.values.milestones.unit = 
    formData.milestoneTimeUnit.value;

  project.values["state-agencies"] = 
    formData.state.checked;

  project.values["hawaiian-time"] = 
    formData.hawaiianTime.checked;

  project.values.testing = 
    projectWeights.testing[formData.testing.value];

  project.values.devops = 
    projectWeights.devops[formData.devops.value];

  project.values.rate = 9;
  if (formData["rate-min"].checked) {
    project.values.rate = 15;
  }
  if (formData["rate-basic"].checked) {
    project.values.rate = 25;
  }
  if (formData["rate-degree"].checked) {
    //project.values.rate = 15;
  }
  if (formData["rate-skillscamp"].checked) {
    project.values.rate = 100;
  }
  if (formData["rate-consultant"].checked) {
    project.values.rate = 300;
  }

  CalculateCost();

  $("#debug").text(
    JSON.stringify(project, null, "\t")
  ); 
}

function CalculateCost() {
  var formData = document.forms[0];

  $("#process").empty();

  AddThoughtProcess("Calculating cost...");
  AddThoughtProcess("Determining hourly rate...");
  if (formData["rate-consultant"].checked) {
      AddThoughtProcess("Looks like you're a consultant.  Rate = $300/hr")
  }
  else if (formData["rate-skillscamp"].checked) {
      AddThoughtProcess("Looks like you haz skillz.  Rate = $100/hr")
  }
  else if (formData["rate-basic"].checked) {
      AddThoughtProcess("Looks like you know the basics.  Rate = $25/hr")
  }
  else if (formData["rate-consultant"].checked) {
      AddThoughtProcess("Looks like you at least know how to turn on a computer.  Rate = $15/hr")
  }
  else {
      AddThoughtProcess("Hmmm, at least theres minimum wage.  Rate = $9/hr")
  }

  if (formData["rate-degree"].checked) {
      AddThoughtProcess("Looks like you have a college degree. Too bad that doesn't mean anything.")
  }

  AddThoughtProcess("Calculating multipliers...");

  var mult = 1;
  var stuff = project.values;

  AddThoughtProcess("Multiplier based on project type: "
    + stuff.projectType)
  mult *= stuff.projectType;

  AddThoughtProcess("Multiplier based on design: "
    + stuff.design)
  mult *= stuff.design;

  if (stuff["design-responsive"]) {
    AddThoughtProcess("Doubling cost cause mobile responsive");
    mult += mult;  // YO THIS IS MORE EFFICIENT THAN *=2
  }

  if (stuff["state-agencies"]) {
    AddThoughtProcess("Doubling cost cause state agencies are involved (duhhh)");
    mult += mult;  // YO THIS IS MORE EFFICIENT THAN *=2
  }

  if (stuff["hawaiian-time"]) {
    AddThoughtProcess("Doubling cost to account for hawaiian time");
    mult += mult;  // YO THIS IS MORE EFFICIENT THAN *=2
  }

  AddThoughtProcess("Multiplier based on testing: "
    + stuff.testing)
  mult *= stuff.testing;

  AddThoughtProcess("Final multiplier: x" + mult)

  AddThoughtProcess("Calculating timeframe...");

  AddThoughtProcess("You noted " + project.values.milestoneCount + " milestones.")

  if (project.values.milestoneCount < 10) {
    AddThoughtProcess("I don't think thats enough.  You should have at least 10.");
    project.values.milestoneCount = 10;
  }

  text = "You selected " + project.values.milestones.num + " " + project.values.milestones.unit + " per milestone.";

  AddThoughtProcess(text);

  milestone_num = project.values.milestones.num * 2

  unit_bump = {
    day: "week",
    week: "month",
    month: "year",
    year: "decade"
  }

  milestone_unit = unit_bump[project.values.milestones.unit];

  AddThoughtProcess("For your sake, I'll bump your time per milestone to " +
    milestone_num + " " + milestone_unit + "s")

  if (milestone_unit == "decade") {
    AddThoughtProcess("Converting... " + milestone_num + " decades = " + milestone_num * 10 + " years");
    milestone_num *= 10;
    milestone_unit = "year"
  }
  if (milestone_unit == "year") {
    AddThoughtProcess("Converting... " + milestone_num + " years = " + milestone_num * 12 + " months");
    milestone_num *= 12;
    milestone_unit = "month"
  }
  if (milestone_unit == "month") {
    AddThoughtProcess("Converting... " + milestone_num + " months = " + milestone_num * 52/12 + " weeks");
    milestone_num *= 52/12;
    milestone_unit = "week"
  }

  // now that we have weeks...
  AddThoughtProcess("40 hours a week = " + milestone_num * 40 + " hours total.")
  milestone_num *= 40;

  total = milestone_num * project.values.rate;
  AddThoughtProcess("" + milestone_num + " hours x $" + project.values.rate + " an hour = $" + total);

  total *= mult;
  AddThoughtProcess("x" + mult + " for earlier multiplier = $" + total);

  total += stuff.devops;
  AddThoughtProcess("+ $" + stuff.devops + " for devops = $" + total)

  AddThoughtProcess("Yup.  $" + total);

  $("#total").text(total);

  OhShit();
}

function OhShit() {
  $(".content").hide(true);

  $(".heading").hide(true);



  $("#process").wrapInner("<h6></h6>");
  $("#debug").wrapInner("<h6></h6>");

  $("#theresult").addClass("redtext");
  $("#theresult").addClass("blink_me");
  $("#theresult").css("font-size", "150px");


  $('body').makeItRain();

  window.scrollTo(0,0);

}

function AddThoughtProcess(text) {
  var newItem = $("<p></p>").text(text);
  $("#process").append(newItem);
}