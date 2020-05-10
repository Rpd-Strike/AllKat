function DeleteAllWithClass(classSelector)
{
    var elements = document.getElementsByClassName(classSelector);
    for (i = 0; i < elements.length; ++i) {
        elements[i].remove();
    }
}

function DeleteModal()
{
    modal = document.getElementsByClassName("cat-modal")[0];
    modal.classList.remove("open");
    modal.classList.add("closed");
}