$(function () { 

    /*  delegated AJAX POST handler for adding/registering staff */
    $(document).on('submit', '.ajaxRegisterStaff', function (e) {
        e.preventDefault();

        const actionUrl  = $(this).attr('action');
        const formData   = $(this).serialize();
        const $submitBtn = $(this).find('[type="submit"]');
        const originalBtnHtml = $submitBtn.html();

        $.ajax({
            url: actionUrl,
            type: 'POST',
            data: formData,
            headers: { 'X-Requested-With': 'XMLHttpRequest' },

            beforeSend: function () {
                $submitBtn.prop('disabled', true)
                          .html('<span class="spinner-border spinner-border-sm me-1"></span> Please wait...');
            },

            success: function (response) {

                $('#registerStaffModal').modal('hide');
                
                if (response.success) {

                     let staffTable = '';

                     for (let i = 0; i < response.users.length; i++) {

                            var statusBadge = '';
                            var actionButtons = '';

                            if (response.users[i].active === 'yes') {

                                    statusBadge = '<span class="badge bg-primary-subtle text-primary rounded-pill">Active</span>';
                                    
                                } else {

                                    statusBadge = '<span class="badge bg-danger-subtle text-danger rounded-pill">Blocked</span>';
                                    
                                }

                            if (response.users[i].active === 'yes') {

                                    actionButtons = '<button type="button" data-id="'+ response.users[i].id +'" class="btn btn-sm btn-danger ajaxBlockUser" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="danger-tooltip" data-bs-title="Block Staff"><i class="bi bi-person-lock"></i></button>';
                                    
                                } else {

                                    actionButtons = '<button type="button" data-id="'+ response.users[i].id +'" class="btn btn-sm btn-success ajaxUnBlockUser" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="success-tooltip" data-bs-title="Un-block Staff"><i class="bi bi-person-lock"></i></button>';
                                    
                                }

                        staffTable += '<tr>'+
                                            '<td>'+ response.users[i].firstname +' '+ response.users[i].surname +'</td>'+
                                            '<td>'+ response.users[i].email +'</td>'+
                                            '<td>'+ response.users[i].phone +'</td>'+
                                            '<td>'+ statusBadge +'</td>'+
                                            '<td>'+
                                                    '<div class="d-flex flex-wrap gap-2">'+
                                                         '<button type="button" data-id="'+ response.users[i].id +'" class="btn btn-warning ajaxGetUser" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="warning-tooltip" data-bs-title="Edit"><i class="mdi mdi-tooltip-edit"></i></button>'+
                                                         actionButtons+
                                                    '</div>'+
                                            '</td>'+
                                        '</tr>';
                     }
                     $(".staffHere").html(staffTable);
                    // Show success modal
                    $("#successAlertModal .mt-2").text(response.message || "Operation successful.");
                    $("#successAlertModal").modal("show");

                } else {
                    // Show errors
                    const errors = Array.isArray(response.errors) ? response.errors : [response.error || "Something went wrong"];
                    $("#displayErrorsHere").html(errors.join("<br>"));
                    $("#warningAlertModal").modal("show");
                }
            },

            error: function (xhr) {

                $('#registerStaffModal').modal('hide');

                let errors = [];

                try {
                        const res = JSON.parse(xhr.responseText);
                        errors = Array.isArray(res.errors) ? res.errors : [res.error || "Unexpected error occurred"];
                    } catch (e) {
                        errors = ["Unexpected error occurred"];
                }

                $("#displayErrorsHere").html(errors.join("<br>"));
                $("#warningAlertModal").modal("show");
            },

             complete: function () {
                // Re-enable submit button & restore original label
                $submitBtn.prop('disabled', false).html(originalBtnHtml);
            }
        });
    });
    /* END of delegated AJAX POST handler for adding/registering staff */

    // Handle staff edit modal
    $(document).on('click', '.ajaxGetUser', function () {
        
        const id = $(this).data('id');
        const $modal = $('#editStaffModal');
        const $form  = $modal.find('.ajaxUpdateStaff');

        $.ajax({
            url: '/api/boss/edit/staff/' + id,
            method: 'GET',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },

            success: function (res) {

                if (!res.success) {
                            alert('Not found');
                            $modal.modal('hide');
                            return;
                }

                $form.attr('action', '/api/boss/staff/update/' + id);
                $form.find('input[name="firstname"]').val(res.staff.firstname);
                $form.find('input[name="surname"]').val(res.staff.surname);
                $form.find('input[name="email"]').val(res.staff.email);
                $form.find('input[name="phone"]').val(res.staff.phone);
                $modal.modal('show');
            },

            error: function () {
                alert('Failed to fetch details.');
                $modal.modal('hide');
            }
        });
    });
    // end of edit service


  /*  delegated AJAX POST handler for updating staff */
    $(document).on('submit', '.ajaxUpdateStaff', function (e) {
        e.preventDefault();

        const actionUrl  = $(this).attr('action');
        const formData   = $(this).serialize();
        const $submitBtn = $(this).find('[type="submit"]');
        const originalBtnHtml = $submitBtn.html();

        $.ajax({
            url: actionUrl,
            type: 'POST',
            data: formData,
            headers: { 'X-Requested-With': 'XMLHttpRequest' },

            beforeSend: function () {
                $submitBtn.prop('disabled', true)
                          .html('<span class="spinner-border spinner-border-sm me-1"></span> Please wait...');
            },

            success: function (response) {

                $('#editStaffModal').modal('hide');
                
                if (response.success) {

                     let staffTable = '';

                     for (let i = 0; i < response.users.length; i++) {

                            var statusBadge = '';
                            var actionButtons = '';

                            if (response.users[i].active === 'yes') {

                                    statusBadge = '<span class="badge bg-primary-subtle text-primary rounded-pill">Active</span>';
                                    
                                } else {

                                    statusBadge = '<span class="badge bg-danger-subtle text-danger rounded-pill">Blocked</span>';
                                    
                                }

                            if (response.users[i].active === 'yes') {

                                    actionButtons = '<button type="button" data-id="'+ response.users[i].id +'" class="btn btn-sm btn-danger ajaxBlockUser" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="danger-tooltip" data-bs-title="Block Staff"><i class="bi bi-person-lock"></i></button>';
                                    
                                } else {

                                    actionButtons = '<button type="button" data-id="'+ response.users[i].id +'" class="btn btn-sm btn-success ajaxUnBlockUser" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="success-tooltip" data-bs-title="Un-block Staff"><i class="bi bi-person-lock"></i></button>';
                                    
                                }

                        staffTable += '<tr>'+
                                            '<td>'+ response.users[i].firstname +' '+ response.users[i].surname +'</td>'+
                                            '<td>'+ response.users[i].email +'</td>'+
                                            '<td>'+ response.users[i].phone +'</td>'+
                                            '<td>'+ statusBadge +'</td>'+
                                            '<td>'+
                                                    '<div class="d-flex flex-wrap gap-2">'+
                                                         '<button type="button" data-id="'+ response.users[i].id +'" class="btn btn-warning ajaxGetUser" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="warning-tooltip" data-bs-title="Edit"><i class="mdi mdi-tooltip-edit"></i></button>'+
                                                         actionButtons+
                                                    '</div>'+
                                            '</td>'+
                                        '</tr>';
                     }
                     $(".staffHere").html(staffTable);
                    // Show success modal
                    $("#successAlertModal .mt-2").text(response.message || "Operation successful.");
                    $("#successAlertModal").modal("show");

                } else {
                    // Show errors
                    const errors = Array.isArray(response.errors) ? response.errors : [response.error || "Something went wrong"];
                    $("#displayErrorsHere").html(errors.join("<br>"));
                    $("#warningAlertModal").modal("show");
                }
            },

            error: function (xhr) {

                $('#editStaffModal').modal('hide');

                let errors = [];

                try {
                        const res = JSON.parse(xhr.responseText);
                        errors = Array.isArray(res.errors) ? res.errors : [res.error || "Unexpected error occurred"];
                    } catch (e) {
                        errors = ["Unexpected error occurred"];
                }

                $("#displayErrorsHere").html(errors.join("<br>"));
                $("#warningAlertModal").modal("show");
            },

             complete: function () {
                // Re-enable submit button & restore original label
                $submitBtn.prop('disabled', false).html(originalBtnHtml);
            }
        });
    });
    /* END of delegated AJAX POST handler for updating staff */

    // Handle blocking & unblocking staff modal
    let blockingId = null;
    let unBlockingId = null;

    $(document).on('click', '.ajaxBlockUser', function () {

            blockingId = $(this).data('id');
            const $form = $('#blockUserForm');

            $form.attr('action', '/api/boss/block/staff/' + blockingId);
            $('#blockStaffModal').modal('show');
        });

    $(document).on('click', '.ajaxUnBlockUser', function () {

            unBlockingId = $(this).data('id');
            const $form = $('#unBlockUserForm');

            $form.attr('action', '/api/boss/unblock/staff/' + unBlockingId);
            $('#unBlockStaffModal').modal('show');
        });

    /*  delegated AJAX POST handler for blocking staff */
    $(document).on('submit', '.ajaxBlockStaff', function (e) {
        e.preventDefault();

        const actionUrl  = $(this).attr('action');
        const formData   = $(this).serialize();
        const $submitBtn = $(this).find('[type="submit"]');
        const originalBtnHtml = $submitBtn.html();

        $.ajax({
            url: actionUrl,
            type: 'POST',
            data: formData,
            headers: { 'X-Requested-With': 'XMLHttpRequest' },

            beforeSend: function () {
                $submitBtn.prop('disabled', true)
                          .html('<span class="spinner-border spinner-border-sm me-1"></span> Please wait...');
            },

            success: function (response) {

                $('#blockStaffModal').modal('hide');
                
                if (response.success) {

                     let staffTable = '';

                     for (let i = 0; i < response.users.length; i++) {

                            var statusBadge = '';
                            var actionButtons = '';

                            if (response.users[i].active === 'yes') {

                                    statusBadge = '<span class="badge bg-primary-subtle text-primary rounded-pill">Active</span>';
                                    
                                } else {

                                    statusBadge = '<span class="badge bg-danger-subtle text-danger rounded-pill">Blocked</span>';
                                    
                                }

                            if (response.users[i].active === 'yes') {

                                    actionButtons = '<button type="button" data-id="'+ response.users[i].id +'" class="btn btn-sm btn-danger ajaxBlockUser" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="danger-tooltip" data-bs-title="Block Staff"><i class="bi bi-person-lock"></i></button>';
                                    
                                } else {

                                    actionButtons = '<button type="button" data-id="'+ response.users[i].id +'" class="btn btn-sm btn-success ajaxUnBlockUser" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="success-tooltip" data-bs-title="Un-block Staff"><i class="bi bi-person-lock"></i></button>';
                                    
                                }

                        staffTable += '<tr>'+
                                            '<td>'+ response.users[i].firstname +' '+ response.users[i].surname +'</td>'+
                                            '<td>'+ response.users[i].email +'</td>'+
                                            '<td>'+ response.users[i].phone +'</td>'+
                                            '<td>'+ statusBadge +'</td>'+
                                            '<td>'+
                                                    '<div class="d-flex flex-wrap gap-2">'+
                                                         '<button type="button" data-id="'+ response.users[i].id +'" class="btn btn-warning ajaxGetUser" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="warning-tooltip" data-bs-title="Edit"><i class="mdi mdi-tooltip-edit"></i></button>'+
                                                         actionButtons+
                                                    '</div>'+
                                            '</td>'+
                                        '</tr>';
                     }

                     $(".staffHere").html(staffTable);

                    // Show success modal
                    $("#successAlertModal .mt-2").text(response.message || "Operation successful.");
                    $("#successAlertModal").modal("show");

                } else {
                    // Show errors
                    const errors = Array.isArray(response.errors) ? response.errors : [response.error || "Something went wrong"];
                    $("#displayErrorsHere").html(errors.join("<br>"));
                    $("#warningAlertModal").modal("show");
                }
            },

            error: function (xhr) {

                $('#blockStaffModal').modal('hide');

                let errors = [];

                try {
                        const res = JSON.parse(xhr.responseText);
                        errors = Array.isArray(res.errors) ? res.errors : [res.error || "Unexpected error occurred"];
                    } catch (e) {
                        errors = ["Unexpected error occurred"];
                }

                $("#displayErrorsHere").html(errors.join("<br>"));
                $("#warningAlertModal").modal("show");
            },

             complete: function () {
                // Re-enable submit button & restore original label
                $submitBtn.prop('disabled', false).html(originalBtnHtml);
            }
        });
    });
    /* END of delegated AJAX POST handler for blocking staff */

    /*  delegated AJAX POST handler for unblocking staff */
    $(document).on('submit', '.ajaxUnBlockStaff', function (e) {
        e.preventDefault();

        const actionUrl  = $(this).attr('action');
        const formData   = $(this).serialize();
        const $submitBtn = $(this).find('[type="submit"]');
        const originalBtnHtml = $submitBtn.html();

        $.ajax({
            url: actionUrl,
            type: 'POST',
            data: formData,
            headers: { 'X-Requested-With': 'XMLHttpRequest' },

            beforeSend: function () {
                $submitBtn.prop('disabled', true)
                          .html('<span class="spinner-border spinner-border-sm me-1"></span> Please wait...');
            },

            success: function (response) {

                $('#unBlockStaffModal').modal('hide');
                
                if (response.success) {

                     let staffTable = '';

                     for (let i = 0; i < response.users.length; i++) {

                            var statusBadge = '';
                            var actionButtons = '';

                            if (response.users[i].active === 'yes') {

                                    statusBadge = '<span class="badge bg-primary-subtle text-primary rounded-pill">Active</span>';
                                    
                                } else {

                                    statusBadge = '<span class="badge bg-danger-subtle text-danger rounded-pill">Blocked</span>';
                                    
                                }

                            if (response.users[i].active === 'yes') {

                                    actionButtons = '<button type="button" data-id="'+ response.users[i].id +'" class="btn btn-sm btn-danger ajaxBlockUser" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="danger-tooltip" data-bs-title="Block Staff"><i class="bi bi-person-lock"></i></button>';
                                    
                                } else {

                                    actionButtons = '<button type="button" data-id="'+ response.users[i].id +'" class="btn btn-sm btn-success ajaxUnBlockUser" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="success-tooltip" data-bs-title="Un-block Staff"><i class="bi bi-person-lock"></i></button>';
                                    
                                }

                        staffTable += '<tr>'+
                                            '<td>'+ response.users[i].firstname +' '+ response.users[i].surname +'</td>'+
                                            '<td>'+ response.users[i].email +'</td>'+
                                            '<td>'+ response.users[i].phone +'</td>'+
                                            '<td>'+ statusBadge +'</td>'+
                                            '<td>'+
                                                    '<div class="d-flex flex-wrap gap-2">'+
                                                         '<button type="button" data-id="'+ response.users[i].id +'" class="btn btn-warning ajaxGetUser" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="warning-tooltip" data-bs-title="Edit"><i class="mdi mdi-tooltip-edit"></i></button>'+
                                                         actionButtons+
                                                    '</div>'+
                                            '</td>'+
                                        '</tr>';
                     }

                     $(".staffHere").html(staffTable);

                    // Show success modal
                    $("#successAlertModal .mt-2").text(response.message || "Operation successful.");
                    $("#successAlertModal").modal("show");

                } else {
                    // Show errors
                    const errors = Array.isArray(response.errors) ? response.errors : [response.error || "Something went wrong"];
                    $("#displayErrorsHere").html(errors.join("<br>"));
                    $("#warningAlertModal").modal("show");
                }
            },

            error: function (xhr) {

                $('#unBlockStaffModal').modal('hide');

                let errors = [];

                try {
                        const res = JSON.parse(xhr.responseText);
                        errors = Array.isArray(res.errors) ? res.errors : [res.error || "Unexpected error occurred"];
                    } catch (e) {
                        errors = ["Unexpected error occurred"];
                }

                $("#displayErrorsHere").html(errors.join("<br>"));
                $("#warningAlertModal").modal("show");
            },

             complete: function () {
                // Re-enable submit button & restore original label
                $submitBtn.prop('disabled', false).html(originalBtnHtml);
            }
        });
    });
    /* END of delegated AJAX POST handler for unblocking staff */

});