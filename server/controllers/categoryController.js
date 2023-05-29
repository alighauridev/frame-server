import Category from "../modals/categoryModel.js"

// Get All Categories Controller

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.send(categories);
    } catch (error) {
        res.status(500).send(error);
    }
};

// create a category
export const createCategory = async (req, res) => {
    try {
        const { name, parentCategory } = req.body;
        const slug = name.toLowerCase().replace(/ /g, "-");

        // Check if the category already exists
        const existingCategory = await Category.findOne({ slug });
        if (existingCategory) {
            return res.status(400).json({ error: "Category already exists" });
        }

        const category = new Category({
            name,
            slug,
            parentCategory,
        });

        await category.save();

        if (parentCategory) {
            await Category.findByIdAndUpdate(parentCategory, {
                $push: { subcategories: category._id },
            });
        }

        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update Category Controller
export const updateCategory = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "slug", "parentCategory", "subcategories"];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" });
    }

    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).send();
        }

        updates.forEach((update) => (category[update] = req.body[update]));
        await category.save();
        res.send(category);
    } catch (error) {
        res.status(400).send(error);
    }
};
// Delete Category Controller
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).send();
        }

        // Remove the category from its parent category's subcategories list
        if (category.parentCategory) {
            await Category.findByIdAndUpdate(category.parentCategory, {
                $pull: { subcategories: category._id },
            });
        }

        await category.remove();

        res.send(category);
    } catch (error) {
        res.status(500).send(error);
    }
};
// Get Main categories Controller



// Get ArtWork Categories Controller

export const getArtworkCategories = async (req, res) => {
    try {
        const category = await Category.find({
            name: "Art Work Custom"
        }).populate('subcategories');
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.json(category);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get Frames Categories Controller

export const getFrameCategories = async (req, res) => {
    try {
        const category = await Category.find({
            name: "Custom Frame Categories"
        }).populate('subcategories');
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.json(category);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};





export const getCategoriesWithSubcategories = async (req, res) => {
    try {
        const topLevelCategories = await Category.find({
            parentCategory: null,
        }).populate("subcategories");
        const categoriesWithSubcategories = await Promise.all(
            topLevelCategories.map(async (topLevelCategory) => {
                const subcategories = await Promise.all(
                    topLevelCategory.subcategories.map(async (subcategoryId) => {
                        const subcategory = await Category.findById(subcategoryId).populate(
                            "subcategories"
                        );
                        return subcategory;
                    })
                );
                return { ...topLevelCategory._doc, subcategories };
            })
        );
        res.status(200).json(categoriesWithSubcategories);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};
