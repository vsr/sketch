/* Author: @vsr

*/

document.ontouchmove = function(ev){
    ev.preventDefault();
};

$(function(){

	var $c = $('#c'),
        c = $c.get(0),
		ctx = c.getContext('2d'),
        headerHeight = $('header').height();

    c.height = window.innerHeight - headerHeight;
    c.width = window.innerWidth;

    ctx.fillStyle = 'white';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.miterLimit = 45;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.paintObj = {'pendown': false};

    $('select[name="size"]').on('change',function(){
        ctx.lineWidth = $(this).val();
    }).change();

    $('select[name=mode]').on('change', function(){
        var mode = $(this).val();
        if(mode==='pencil') {
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = 'black';
        }
        else {
            //ctx.globalCompositeOperation = "destination-out";
            //ctx.strokeStyle = 'rgba(0,0,0,1)';
            ctx.strokeStyle = 'white';
        }
        $c.removeClass('pencil eraser').addClass(mode);
    }).change();


    function touchEvent(ev){
        if(ev.originalEvent.touches && ev.originalEvent.touches[0]) {
            ev = ev.originalEvent.touches[0];
        }
        return ev;
    }

    $c.on('mousedown touchstart', function(ev){
        var x, y;

        ev = touchEvent(ev);
        x = ev.pageX - c.offsetLeft;
        y = ev.pageY - c.offsetTop;

        ctx.paintObj.pendown = true;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ev.preventDefault();

    }).on('mouseout', function(){
        ctx.paintObj.pendown = false;
    }).on('mouseup touchend', function(ev){
        ctx.paintObj.pendown = false;
    }).on('mousemove touchmove', function(ev){
        var x,y;
        if(ctx.paintObj.pendown) {

            ev = touchEvent(ev);
            x = ev.pageX - c.offsetLeft;
            y = ev.pageY - c.offsetTop;

            ctx.lineTo(x, y);
            ctx.stroke();
        }
    });


    $('#upload').click(function(){
        var img, title, w,
            caption = 'Sketch created on '+window.location.href;

        try {
            img = c.toDataURL('image/jpeg', 0.9).split(',')[1];
        } catch(e) {
            img = c.toDataURL().split(',')[1];
        }
        title = prompt('Title for the sketch') || '';

        w = window.open();
        w.document.write('Uploading to Imgur.com ...');

        $.ajax({
            url: 'http://api.imgur.com/2/upload.json',
            type: 'POST',
            data: {
                type: 'base64',
                key: 'b6a0c97256009370c470c18a1c52ff79',
                name: 'sketch.jpg',
                title: title,
                caption: caption,
                image: img
            },
            dataType: 'json',
            success: function(data) {
                w.location.href = data['upload']['links']['imgur_page'];
            },
            error: function() {
                alert('There was some problem uploading image to imgur.com. Sorry :(');
                w.close();
            }
        });


    });


});
