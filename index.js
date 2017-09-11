var currentEntry = "";

$(document).ready(function() {
    init();

    $("#add").click(function() {
        currentEntry = "";
        var e = new Entry();
        displayEntry(e);
    });

    $("#del").click(function() {
        if(currentEntry !== ""){
            removeEntry(currentEntry);
            currentEntry = "";
            displayEntryList("#list");
            saveList();
        }
    });

    $("#update").click(function() {
        if(currentEntry === ""){
            addNewEntry();
        } else {
            updateEntry();
        }
        displayEntryList("#list");
        saveList();
    });
});

$(document).on('click', "#list a", function() {
    currentEntry = $(this).text();
    var e = getEntryFromDisplayName(currentEntry);
    displayEntry(e);
});

function init(){
    loadList();
    displayEntryList("#list");
}

var Entry = function(name, homephone, workphone, email, workemail) {
    this.name = name;
    this.homephone = homephone;
    this.workphone = workphone;
    this.email = email;
    this.workemail = workemail;
}

Entry.prototype.displayName = function() {
    var firstnames, surname;
    firstnames = this.name.substring(0, this.name.lastIndexOf(" ")).trim();
    surname = this.name.substring(this.name.lastIndexOf(" ") + 1);
    return surname + ", " + firstnames;
}

Entry.prototype.changeName = function(firstnames, surname){
    this.name = firstnames.trim() + " " + surname.trim();
    return this;
}

var entries = [];

function addEntry(name, homephone, workphone, email, workemail) {
    var e = new Entry(name, homephone, workphone, email, workemail);
    entries.push(e);
    sortEntries();
    return e;
}

function removeEntry(name){
    var pos = -1, index, entry = null;
    for(index = 0; index < entries.length; index += 1){
        if(name === entries[index].displayName()) {
            pos = index;
            break;
        }
    }
    if(pos > -1) {
        entry = entries[pos];
        entries.splice(pos, 1);
    }
    return entry;
}

function sortEntries() {
    entries.sort(function(a, b) {
        if(a.displayName() < b.displayName()){
            return -1;
        }
        if(a.displayName() > b.displayName()) {
            return 1;
        }
        return 0;
    });
    return entries;
}

function entryList(){
    var index, list = "";
    for(index = 0; index < entries.length; index += 1){
        list += "<li><a href='#entry'>" + entries[index].displayName() + "</a></li>";
    }
    return list;
}

function displayEntryList(listElement){
    $(listElement).html(entryList()).listview('refresh');
    return $(listElement);
}

function getEntryFromDisplayName(displayName){
    var index, e;
    for(index = 0; index < entries.length; index += 1){
        if(entries[index].displayName() === displayName){
            return entries[index];
        }
    }
    return null;
}

function displayEntry(e){
    $("#fullname").val(e.name);
    $("#homephone").val(e.homephone);
    $("#workphone").val(e.workphone);
    $("#email").val(e.email);
    $("#workemail").val(e.workemail);
}

function updateEntry(){
    var e = getEntryFromDisplayName(currentEntry);
    e.name = $("#fullname").val();
    e.homephone = $("#homephone").val();
    e.workphone = $("#workphone").val();
    e.email = $("#email").val();
    e.workemail = $("#workemail").val();
}

function addNewEntry(){
    var name = $("#fullname").val(),
        homephone = $("#homephone").val(),
        workphone = $("#workphone").val(),
        email = $("#email").val(),
        workemail = $("#workemail").val();
    if(name !== "") {
        return addEntry(name, homephone, workphone, email, workemail);
    } else {
        return null;
    }
}

function saveList(){
    var strList = JSON.stringify(entries);
    localStorage.phoneBook = strList;
}

function loadList(){
    var strList;
    strList = localStorage.phoneBook;
    if(strList){
        entries = JSON.parse(strList);
        var proto = new Entry();
        for(e in entries){
            entries[e].__proto__ = proto;
        }
    } else {
        entries = [];
    }
}