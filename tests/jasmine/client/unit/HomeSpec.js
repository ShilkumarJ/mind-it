describe('Home page localstorage', function () {
    it("should clear mindmap related data", function () {
        Template.home.clearNodeCollapsedState();
        var id="";
        for (var key in localStorage){
            if(key.indexOf("Meteor") == -1 && key.indexOf("amplify") == -1) {
                id = key;
            }
        }
        expect(id).toBe("");
    });
});