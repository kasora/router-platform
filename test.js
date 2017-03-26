

function f1(cb) {
    console.log("1");
    setTimeout(function () {
        cb();
    }, 500);
}



function f2() {
    console.log("2");
}

function f3() {
    console.log("3");
}

f1(f2);
f3();
f1(f2);
f3();
f1(f2);
f3();
f1(f2);