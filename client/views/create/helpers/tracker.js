App.tracker = {
    added: function (id, fields) {
        var newNode = App.map.getNodeDataWithNodeId(id);
        if (newNode) {

            if (newNode.name != fields.name) {
                newNode.name = fields.name;
                App.chart.update();
            }
            var selectedNode = App.map.getDataOfNodeWithClassNamesString(".node.selected");
            //redraw gray box
            if (selectedNode && selectedNode._id === id) {
                setTimeout(function () {
                    App.selectNode(selectedNode);
                }, 1);
            }
            return;
        }
        newNode = fields;
        newNode._id = id;

        var parent = App.map.getNodeDataWithNodeId(newNode.parentId);
        App.nodeStore[id] = newNode;
        App.map.addNodeToUI(parent, newNode);
        App.nodeSelector.setPrevDepth(newNode.depth);
    },

    updateSubTreeIfNodePresent: function (parent, key) {
        newSubTree = childIds.map(
            function (childid) {
                return App.map.getNodeDataWithNodeId(childid);
            });


        App.Node.setSubTree(parent, newSubTree, key);
        App.chart.update();
        if (App.tracker.repaintNodeId) {
            var node = d3.selectAll(".node")[0].find(
                function (child) {
                    return child.__data__._id == App.tracker.repaintNodeId;
                });
            if (node) {
                changeCurrentNodeClass(node);
            }
            App.tracker.repaintNodeId = null;
            App.chart.update();
        }
        return node;
    }, addNodeToNodeStore: function (fields, parent) {
        var dir = fields.hasOwnProperty("left") ? "left" : (fields.hasOwnProperty("right") ? "right" : App.getDirection(parent))
        siblings = App.Node.isRoot(parent) ? parent[dir] : parent.childSubTree;
        var tempFields = App.Node("", dir, parent, null) ? App.Node("", dir, parent, siblings.length) : new Object(new App.Node("", dir, parent, siblings.length));
        App.tracker.added(newlyAddedId, tempFields);
    },
    updateSubTreeIfNodeAbsent: function (parent, fields, key) {
        var flag = false;
        if (App.map.getNodeDataWithNodeId(newlyAddedId) != null) {
            flag = true;
        }

        if (!flag && parent) {
            this.addNodeToNodeStore(fields, parent);
        }

        subTree = App.Node.getSubTree(parent, key),
            newSubTree = childIds.map(
                function (childid) {
                    return subTree.find(
                        function (node) {
                            return node._id === childid;
                        });
                });

        var movedNode = App.map.getNodeDataWithNodeId(newlyAddedId);
        if (subTree.indexOf(movedNode) == -1)
            subTree.splice(childIds.indexOf(newlyAddedId), 0, movedNode);
        newlyAddedId = null;


    }, updateSubtree: function (id, fields, key) {
        var parent = App.map.getNodeDataWithNodeId(id),
            isCollapsed = parent.isCollapsed;
        // var key = Object.keys(fields)[0],

        subTree = App.Node.getSubTree(parent, key),
            childIds = fields[key],
            selectedNode = App.map.getDataOfNodeWithClassNamesString(".node.selected"),
            newlyAddedId = App.getNewlyAddedNodeId(parent, fields);


        if (newlyAddedId == null) {
            var node = this.updateSubTreeIfNodePresent(parent, key);

        } else {
            this.updateSubTreeIfNodeAbsent(parent, fields, key);
        }
        return node;
    },


    updateNameOfNode: function (updatedNode, fields, id) {
        updatedNode.name = fields.name;
        if (updatedNode.hasOwnProperty("left")) {
            App.chart.update();
        }
        var selectedNode = App.map.getDataOfNodeWithClassNamesString(".node.selected");
        // redraw gray box
        if (selectedNode && selectedNode._id === id) {
            setTimeout(function () {
                App.selectNode(selectedNode);
            }, 10);
        }
    }, changed: function (id, fields) {

        var updatedNode = App.map.getNodeDataWithNodeId(id);
        if (!updatedNode) return;
        if (fields.hasOwnProperty('name')) {
            App.tracker.updateNameOfNode(updatedNode, fields, id);

        }
        if (fields.hasOwnProperty('childSubTree')) {

            var node = App.tracker.updateSubtree(id, fields, 'childSubTree');
        }
        if (fields.hasOwnProperty('left')) {
            var node = App.tracker.updateSubtree(id, fields, 'left');

        }
        if (fields.hasOwnProperty('right')) {
            var node = App.tracker.updateSubtree(id, fields, 'right');
        }
        if (fields.hasOwnProperty('parentId')) {
            if (!fields.parentId) return;
            App.tracker.repaintNodeId = id;
            if (fields.parentId != "None") {
                var selectedNode = App.map.getNodeDataWithNodeId(id),
                    newParent = App.map.getNodeDataWithNodeId(fields.parentId);
                selectedNode.parent = newParent;
                selectedNode.parentId = newParent._id;

            }

        }
        App.chart.update();
    }
};

var changeCurrentNodeClass = function (node) {
    var tempD3Array = d3.select('thisIsANonExistentTag');
    tempD3Array[0].pop();
    tempD3Array[0].push(node);
    App.removeAllLevelClass(tempD3Array);
    App.applyLevelClass(tempD3Array, node.__data__.depth);
    App.applyClassToSubTree(node.__data__, null, App.removeAllLevelClass);
    App.applyClassToSubTree(node.__data__, null, App.applyLevelClass);

    tempD3Array[0].pop();
    App.resetPathClassForCurrentNode(null, node.__data__);
};