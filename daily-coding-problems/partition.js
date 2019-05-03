var togglePartition = function(toggleId,targetId,factorsId) {
    var toggleInput = document.getElementById(toggleId);
    var checked = toggleInput.checked;
    if (checked) {
        console.log("checked=" + checked);
        var factors = document.getElementById(factorsId);
        var targetInput  = document.getElementById(targetId);
        var target = parseInt(targetInput.value);
        var factorsArray = [];
        var factorsString = "";
        for (var i = 1; i <= target; i++) {
            factorsArray.push(i);
        }
        factorsString = factorsArray.join(" ");
        factors.value = factorsString;
    } else {
        console.log("Is checked=" + checked);
    }
}