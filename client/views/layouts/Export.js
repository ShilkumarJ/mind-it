Template.Export.events({

    'click': function (e ,args) {
        e.preventDefault();
        var rootName = d3.select(".node.level-0")[0][0].__data__.name;
        App.exportParser.export(rootName);
        //App.exportParser.export();
    },


});
Template.ExportImageButton.events({
    'click': function (e ,args) {
        e.preventDefault();
        var rootName = d3.select(".node.level-0")[0][0].__data__.name;
        App.exportParser.export(rootName);
        //App.exportParser.export();
    }
});