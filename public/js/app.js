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
    function getEmployees() {
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
    }

    if($('#employee_list').hasClass('active')) {
        getEmployees();
    }

    $('a[data-item=employee_list]').on('click', function (ev) {
        getEmployees();
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
            url: '/dashboard/employee/report/' + userId,
            method: 'get',
            data: formValues
        })
        .done(function(data) {
                if (data.type === 'error') return;

                var entry = $('#reports-list .report-entry.head'),
                    newEntry,
                    reports = data.reports;
                entry.removeClass('hidden');
                $('#reports-list .report-entry:not(.head)').remove();

                for (let i = 0; i < reports.length; i++) {
                    newEntry = entry.clone();
                    var name = (reports[i].user.first_name && reports[i].user.last_name) ? reports[i].user.first_name + ' ' + reports[i].user.last_name : reports[i].user.username;

                    newEntry.find('.user').text(name);
                    newEntry.find('.type').text(reports[i].type);
                    newEntry.find('.amount').text(reports[i].amount);
                    newEntry.find('.from').text(reports[i].from);
                    newEntry.find('.to').text(reports[i].to);
                    var date = new Date(reports[i].created_date).toLocaleDateString();
                    newEntry.find('.date').text(date);
                    newEntry.removeClass('head').appendTo('#reports-list');
                }
        });

    });


    /* REGULAR USER JS */
    function getClients() {
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
    }
    if($('#client_list').hasClass('active')) {
        getClients();
    }

    $('a[data-item=client_list]').on('click', function (ev) {
        getClients();
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

    /* ACCOUNTS */
    $(document).on('click', '.manage-accounts', function() {
        var clientId = $(this).parents('.entry').attr('data-client-id'),
            clientName = $(this).parents('.entry').find('.name').text(),
            entry = $('#account_list .entry.hidden');

        $('#account_list .entry:not(.hidden)').remove();
        $.ajax({
            url: '/clients/accounts_list/' + clientId,
            method: 'get'
        }).
        done(function (data) {
            if (data.type === 'error') return;

            var newEntry,
                accounts = data.accounts;

            $('#account_list').attr('data-client-id', clientId);

            for (let i = 0; i < accounts.length; i++) {
                newEntry = entry.clone();

                newEntry.attr('data-account-id', accounts[i].account_id);
                newEntry.find('.name').text(accounts[i].account_id);
                newEntry.find('.type').text(accounts[i].account_type);
                newEntry.find('.amount').text(accounts[i].money_amount);
                newEntry.find('.created-date').text(accounts[i].created_date);
                newEntry.removeClass('hidden').appendTo('.account-entries');
            }
        });
        $('#manage_accounts .title').html(`Manage accounts for <b>${clientName}</b>`);
        $('.manage_accounts_link').click();
    })

    $(document).on('click', '.edit-account', function () {
        var accountId = $(this).parents('.entry').attr('data-account-id');
        $.ajax({
            url: '/clients/account/' + accountId,
            method: 'GET'
        })
            .done(function(data) {
                if (data.type === 'error') return;

                $('#edit-account-modal .modal-title').text('Edit account');
                $('#account_info [name=account_id]').val(data.account.account_id);
                $('#account_info [name=client_id]').val($('#account_list').attr('data-client-id'));
                setFormValues($('#account_info'), data.account);
                $('#edit-account-modal').modal();
            });
    });

    $(document).on('click', '.add-account', function () {
        $('#edit-account-modal .modal-title').text('Add new account');
        $('#account_info')[0].reset();
        $('#account_info [name=client_id]').val($('#account_list').attr('data-client-id'));
        $('#edit-account-modal').modal();
    });

    $('#save_account_info').on('click', function(ev) {
        ev.preventDefault();
        var formValues = objectifyFormValues($('#account_info')),
            clientId = formValues.client_id,
            accountId = formValues.account_id;
        let method = !accountId ? 'post' : 'put';

        $.ajax({
            url: '/clients/account',
            method: method,
            data: formValues
        })
            .done(function(data) {
                if (data.type === 'error') return;
                $('#account_info .alert').slideDown();

                var newEntry,
                    account = data.account;

                if (method == 'post') {
                    var entry = $($('#account_list .entry').get(0)),
                        newEntry = entry.clone();
                } else {
                    newEntry = $('#account_list .entry[data-account-id=' + accountId + ']');
                }

                newEntry.find('.name').text(account.account_id);
                newEntry.find('.type').text(account.account_type);
                newEntry.find('.amount').text(account.money_amount);

                if (method == 'post') {
                    newEntry.attr('data-account-id', account.id);
                    newEntry.removeClass('hidden').appendTo('.account-entries');
                }
            });
    });

    $(document).on('click', '.remove-account', function () {
        const elem = $(this),
            accountId = elem.parents('.entry').attr('data-account-id');

        $.ajax({
            url: '/clients/account/' + accountId,
            method: 'delete'
        })
            .done(function() {
                elem.parents('.entry').remove();
            })
    });

    $('#edit-account-modal').on('hidden.bs.modal', function () {
        $('#account_info .alert').hide();
        $('#account_info')[0].reset();
    });

    /* TRANSACTIONS */
    $(document).on('click', '.new-transaction', function () {
        var accountId = $(this).parents('.entry').attr('data-account-id');

        $.ajax({
            url: '/clients/accounts_list',
            method: 'get'
        }).
            done(function (data) {
                if (data.type === 'error') return;

                var accounts = data.accounts;

                for (let i = 0; i < accounts.length; i++) {
                    if (accounts[i].account_id != accountId) {
                        var option = $('<option value=' + accounts[i].account_id + '>'+accounts[i].account_id + '</option>');
                        option.appendTo('#select_accounts');
                    }
                }
            });

        $('#transaction-modal [name=from]').val(accountId);
        $('#transaction-modal [name=from]').val(accountId);
        $('#transaction-modal').modal();
    });

    $('#transaction_type').on('change', function () {
         if ($(this).val() === 'payment') {
            $('label[for=select_accounts]').text('Pay for:');
            $('#transaction_form .to').addClass('hidden');
            $('#transaction_form .bill').removeClass('hidden');
         } else {
             $('label[for=select_accounts]').text('Transfer to:');
             $('#transaction_form .to').removeClass('hidden');
             $('#transaction_form .bill').addClass('hidden');
         }
    });


    $('#process_transfer').on('click', function (e) {
        e.preventDefault();
        var formData = objectifyFormValues($('#transaction_form'));
        if (!formData.to) {
            formData.to = formData.bill;
            delete formData.bill;
        }
        $.ajax({
            url: 'clients/transaction',
            method: 'post',
            data: formData
        }).
        done(function(data) {
            if (data.type === 'success') {
                $('#transaction_form .alert').removeClass('alert-danger').addClass('alert-success');
            } else {
                $('#transaction_form .alert').removeClass('alert-success').addClass('alert-danger');
            }
            $('#transaction_form .alert').text(data.message).slideDown();
            console.log('data', data);
        });
    })

    $('#transaction-modal').on('hidden.bs.modal', function () {
        $('#transaction_form .alert').hide();
        $('#transaction_form')[0].reset();
    });
});

function objectifyFormValues($form) {
    var values = $form.serializeArray(),
        obj = {};

    values.map(function(val) {
        if (val.value != '' && !$form.find('[name=' + val.name + ']').hasClass('hidden')) {
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