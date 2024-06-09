// // Component to handle protected setup routes
// function ProtectedSetup() {
//     // Check if the user is an admin or a trainer
//     const isAdmin = checkAdmin(); // You need to implement this function
//     const isTrainer = checkTrainer(); // You need to implement this function

//     // Render the appropriate component based on user role
//     if (isAdmin) {
//         return (
//             <AdminProtectedRoute>
//                 <AdminSetup />
//             </AdminProtectedRoute>
//         );
//     } else if (isTrainer) {
//         return (
//             <TrainerProtectedRoute>
//                 <TrainerSetup />
//             </TrainerProtectedRoute>
//         );
//     } else {
//         // Handle the case where the user is neither an admin nor a trainer
//         return <Redirect to="/" />;
//     }
// }