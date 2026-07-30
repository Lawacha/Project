let addUser = async () => {
    let user1 = await User.findOne({ username: "supp" });

    if (!user1) {
        user1 = new User({
            username: "supp",
            address: []
        });
    }

    user1.address.push({
        location: "bkt",
        city: "chundevi"
    });

    await user1.save();

    console.log("User saved successfully");
};

addUser();