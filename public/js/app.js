/**
 * Created by Adrian on 4/10/2016.
 */
'use strict';

$(document).ready(function() {
    $('input#birth_date').datepicker({dateFormat: 'mm/dd/yy'});
    $('input#start_date').datepicker({dateFormat: 'mm/dd/yy'});
    $('input#end_date').datepicker({dateFormat: 'mm/dd/yy'});

    $('.content-toggle a[data-item]').on('click', function(ev) {
        ev.preventDefault();
        const itemId = $(this).attr('data-item');
        $('.content-toggle li.active').removeClass('active');
        $(this).parent().addClass('active');
        $('.content .item.active').removeClass('active');
        $('#' + itemId).addClass('active');
    });

    /* ADMIN SPECIFIC JS */
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

                newEntry.attr('data-user-id', users[i].id);
                newEntry.find('.avatar-holder').css('background-image', "url(/images/" + avatar + ")");
                newEntry.find('.name').text(name);
                newEntry.find('.email').text(users[i].email);
                newEntry.find('.phone').text(users[i].phone);
                newEntry.removeClass('hidden').appendTo('.user-entries');
            }
        });
    });

    $(document).on('click', '.edit-user', function () {
        var userId = $(this).parents('.entry').attr('data-user-id');
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

    $(document).on('click', '.add-user', function () {
        $('#edit-user-modal .modal-title').text('Add new user');
        $('#user_info')[0].reset();
        $('#edit-user-modal').modal();
    });

    $('#save_user_info').on('click', function(ev) {
        ev.preventDefault();
        var formValues = objectifyFormValues($('#user_info')),
            userId = formValues.id;
        let method = !userId ? 'post' : 'put';

        $.ajax({
            url: '/dashboard/employee',
            method: method,
            data: formValues
        })
        .done(function(data) {
            if (data.type === 'error') return;
            $('#user_info .alert').slideDown();

            var newEntry,
                user = data.user;

            if (method == 'post') {
                var entry = $($('#employee_list .entry').get(0)),
                newEntry = entry.clone();
            } else {
                newEntry = $('#employee_list .entry[data-user-id=' + userId + ']');
            }

            var name = (user.first_name && user.last_name) ? user.first_name + ' ' + user.last_name : user.username,
                avatar = user.avatar ? user.avatar : 'noavatar.jpg';

            newEntry.find('.avatar-holder').css('background-image', "url(/images/" + avatar + ")");
            newEntry.find('.name').text(name);
            newEntry.find('.email').text(user.email);
            newEntry.find('.phone').text(user.phone);

            if (method == 'post') {
                newEntry.attr('data-user-id', user.id);
                newEntry.removeClass('hidden').appendTo('.user-entries');
            }
        });


    });

    $('#edit-user-modal').on('hidden.bs.modal', function () {
        $('#user_info .alert').hide();
        $('#user_info')[0].reset();
    });

    $(document).on('click', '.remove-user', function () {
        const elem = $(this),
            userId = elem.parents('.entry').attr('data-user-id');

        $.ajax({
            url: '/dashboard/employee/' + userId,
            method: 'delete'
        })
            .done(function() {
                elem.parents('.entry').remove();
            })
    });

    $(document).on('click', '.view-report', function () {
        const elem = $(this),
            entry = elem.parents('.entry'),
            userId = entry.attr('data-user-id'),
            name = entry.find('.name').text();

        $('#reports-modal .modal-title').text('View report for ' + name);
        $('#reports-modal').attr('data-user-id', userId);
        $('#reports-modal').modal();
    });

    $(document).on('click', '#generate-report', function () {
        var formValues = objectifyFormValues($('#report-form')),
            userId = $('#reports-modal').attr('data-user-id');

        $.ajax({
            url: '/dashboard/employee/report',
            method: 'get',
            data: Object.assign({user_is: userId}, formValues)
        })
        .done(function(data) {
                console.log('data REPORt', data);
        });

    });


    /* REGULAR USER JS */
    $('a[data-item=client_list]').on('click', function (ev) {
        if ($('#client_list .entry:not(.hidden)').length > 0) {
            return;
        }

        $.ajax({
            url: '/clients/clients_list',
            method: 'GET'
        })
            .done(function(data) {
                if (data.type === 'error') return;

                var entry = $('#client_list .entry'),
                    newEntry,
                    clients = data.clients;

                for (let i = 0; i < clients.length; i++) {
                    newEntry = entry.clone();

                    newEntry.attr('data-client-id', clients[i].id);
                    newEntry.find('.name').text(clients[i].name);
                    newEntry.find('.id_card_number').text(clients[i].id_card_number);
                    newEntry.find('.cnp').text(clients[i].cnp);
                    newEntry.find('.address').text(clients[i].address);
                    newEntry.find('.email').text(clients[i].email);
                    newEntry.find('.phone').text(clients[i].phone);
                    newEntry.removeClass('hidden').appendTo('.client-entries');
                }
            });
    });
    
    $(document).on('click', '.edit-client', function () {
        var clientId = $(this).parents('.entry').attr('data-client-id');
        $.ajax({
            url: '/clients/client/' + clientId,
            method: 'GET'
        })
            .done(function(data) {
                if (data.type === 'error') return;

                $('#edit-client-modal .modal-title').text('Edit client info');
                $('#client_info [name=id]').val(data.client.id);
                setFormValues($('#client_info'), data.client);
                $('#edit-client-modal').modal();
            });
    });

    $(document).on('click', '.add-client', function () {
        $('#edit-client-modal .modal-title').text('Add new client');
        $('#client_info')[0].reset();
        $('#edit-client-modal').modal();
    });

    $('#save_client_info').on('click', function(ev) {
        ev.preventDefault();
        var formValues = objectifyFormValues($('#client_info')),
            clientId = formValues.id;
        let method = !clientId ? 'post' : 'put';

        $.ajax({
            url: '/clients/client',
            method: method,
            data: formValues
        })
            .done(function(data) {
                if (data.type === 'error') return;
                $('#client_info .alert').slideDown();

                var newEntry,
                    client = data.client;

                if (method == 'post') {
                    var entry = $($('#client_list .entry').get(0)),
                        newEntry = entry.clone();
                } else {
                    newEntry = $('#client_list .entry[data-client-id=' + clientId + ']');
                }

                newEntry.find('.name').text(client.name);
                newEntry.find('.id_card_number').text(client.id_card_number);
                newEntry.find('.cnp').text(client.cnp);
                newEntry.find('.address').text(client.address);
                newEntry.find('.email').text(client.email);
                newEntry.find('.phone').text(client.phone);

                if (method == 'post') {
                    newEntry.attr('data-client-id', client.id);
                    newEntry.removeClass('hidden').appendTo('.client-entries');
                }
            });


    });

    $('#edit-client-modal').on('hidden.bs.modal', function () {
        $('#client_info .alert').hide();
        $('#client_info')[0].reset();
    });

    $(document).on('click', '.manage-accounts', function() {
        var clientId = $(this).parents('.entry').attr('data-client-id'),
            clientName = $(this).parents('.entry').find('.name').text();

        $.ajax({
            url: '/clients/accounts/' + clientId,
            method: 'get'
        }).
        done(function (data) {
            if (data.type === 'error') return;

            var entry = $('#account_list .entry'),
                newEntry,
                accounts = data.accounts;

            for (let i = 0; i < accounts.length; i++) {
                newEntry = entry.clone();

                newEntry.attr('data-account-id', accounts[i].id);
                newEntry.find('.name').text(accounts[i].client.id_card_number);
                newEntry.find('.type').text(accounts[i].type);
                newEntry.find('.amount').text(accounts[i].money_amount);
                newEntry.find('.created-date').text(accounts[i].created_date);
                newEntry.removeClass('hidden').appendTo('.account-entries');
            }
        });

        $('#manage_accounts .title').html(`Manage accounts for <b>${clientName}</b>`);
        $('.manage_accounts_link').click();
    })
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
        if (key == 'birth_date' && val) {
            val = new Date(val).toLocaleDateString();
        }
        $form.find('[name=' + key + ']').val(val);
    });
}