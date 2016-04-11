/**
 * Created by Adrian on 4/10/2016.
 */
'use strict';

$(document).ready(function() {
    $('.content-toggle a[data-item]').on('click', function(ev) {
        ev.preventDefault();
        const itemId = $(this).attr('data-item');
        $('.content-toggle li.active').removeClass('active');
        $(this).parent().addClass('active');
        $('.content .item.active').removeClass('active');
        $('#' + itemId).addClass('active');
    });

    $('a[data-item=employee_list]').on('click', function (ev) {
        if ($('#employee_list .entry:not(.hidden)').length > 0) {
            return;
        }

        $.ajax({
            url: '/dashboard/employee_list',
            method: 'GET'
        })
        .done(function(data) {
            if (data.type === 'error') return;

            var entry = $('#employee_list .entry'),
                newEntry,
                users = data.users;

            for (let i = 0; i < users.length; i++) {
                newEntry = entry.clone();
                var name = (users[i].first_name && users[i].last_name) ? users[i].first_name + ' ' + users[i].last_name : users[i].username,
                    avatar = users[i].avatar ? users[i].avatar : 'noavatar.jpg';

                newEntry.find('.avatar-holder').css('background-image', "url(/images/" + avatar + ")");
                newEntry.find('.name').text(name);
                newEntry.find('.email').text(users[i].email);
                newEntry.find('.phone').text(users[i].phone);
                newEntry.find('.edit-user').attr('data-user-id', users[i].id);
                newEntry.removeClass('hidden').appendTo('.user-entries');
            }
        });
    });

    $(document).on('click', '.edit-user', function () {
        var userId = $(this).attr('data-user-id');
        $.ajax({
            url: '/dashboard/employee',
            method: 'GET',
            data: {
                user_id: userId
            }
        })
        .done(function(data) {
            if (data.type === 'error') return;

            $('#edit-user-modal .modal-title').text('Edit ' + data.user.username + '\'s info');
            $('#user_info [name=id]').val(data.user.id);
            setFormValues($('#user_info'), data.user);
            $('#edit-user-modal').modal();
        });
    });

    $('#save_user_info').on('click', function(ev) {
        ev.preventDefault();

        $.ajax({
            url: '/dashboard/employee',
            method: 'PUT',
            data: objectifyFormValues($('#user_info'))
        })
        .done(function(data) {
            if (data.type === 'error') return;
            $('#user_info .alert').slideDown();
        });
    });
    $('#edit-user-modal').on('hidden.bs.modal', function () {
        $('#user_info .alert').hide();
        $('#user_info')[0].reset();
    });

});

function objectifyFormValues($form) {
    var values = $form.serializeArray(),
        obj = {};

    values.map(function(val) {
        if (val.value != '') {
            obj[val.name] = val.value;
        }
    });

    return obj;
}

function setFormValues($form, values) {
    $.each(values, function(key, val) {
        $form.find('[name=' + key + ']').val(val);
    });
}