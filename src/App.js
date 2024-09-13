import { useEffect, useState } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts.js';


function App() {
    const [attributes, setAttributes] = useState(createAttributes());
    const [attributesModifier, setAttributesModifier] = useState(createAttributesModifier());
    const [skills, setSkills] = useState(createSkills());
    const [selectedClass, setSelectedClass] = useState();
    const [showClassStatistics, setShowClassStatistics] = useState(false);
    const [passedClasses, setPassedClasses] = useState([]);

    // Update when minimum stats are reached for a class
    useEffect(() => {
        const classes = Object.keys(CLASS_LIST)
        for (const className of classes) {
            // if greater than all min attribute value > show green emoji next to class
            const passed = passedClasses.findIndex(name => name === className)
            if (passed === -1 && meetsMinimumClassRequirements(className)) {
                passedClasses.push(className);
                setPassedClasses([...passedClasses])
            }
            else {
                if (passed !== -1) {
                    setPassedClasses((currentPassedClasses) => currentPassedClasses.filter((name) => name !== className))
                }
            }
        }

        function meetsMinimumClassRequirements(className) {
            const attributeKeys = Object.keys(CLASS_LIST[className]);
            for (const attr of attributeKeys) {
                if (attributes[attr] < CLASS_LIST[className][attr]) {
                    return false;
                }
            }

            return true;
        }
    }, [attributes])

    // Update attribute modifiers
    useEffect(() => {
        for (const name of ATTRIBUTE_LIST) {
            const delta = Math.floor(attributes[name] - 10)
        }
    }, [attributes])


    function createAttributes() {
        const attributesObj = Object.create(null);
        for (const attr of ATTRIBUTE_LIST) {
            attributesObj[attr] = 10;
        }

        return attributesObj;
    }

    function createAttributesModifier() {
        const attributesModifierObj = Object.create(null);
        for (const attr of ATTRIBUTE_LIST) {
            attributesModifierObj[attr] = 0;
        }

        return attributesModifierObj;
    }

    function createSkills() {
        return SKILL_LIST.map((skill) => ({
            name: skill.name,
            attributeModifier: skill.attributeModifier,
            count: 0
        }))
    }

    function updateAttributeCount(attribute, count) {
        attributes[attribute] += count

        const delta = attributes[attribute] - 10
        attributesModifier[attribute] = Math.floor(delta / 2)

        setAttributes({ ...attributes })
        setAttributesModifier({ ...attributesModifier })
    }

    function displayAttributes() {
        const attributesList = Object.entries(attributes);
        return (
            <div>
                {
                    attributesList.map(([name, value]) => (
                        <div>
                            <p>{name}: {value} (Modifier: {attributesModifier[name]})</p>
                            <button key={`${name}-decrement`} onClick={() => updateAttributeCount(name, -1)}>-</button>
                            <button key={`${name}-increment`} onClick={() => updateAttributeCount(name, 1)}>+</button>
                        </div>
                    ))
                }
            </div>
        )
    }

    function displayClasses() {
        const classes = Object.keys(CLASS_LIST)
        return (
            <div>
                {
                    classes.map(className => {
                        const passed = passedClasses.findIndex(name => name === className) !== -1
                        return (
                            <button onClick={() => {
                                openClassStatistics(className)
                            }}>
                                <h3 style={{ backgroundColor: passed ? 'green' : 'white' }}>{className}{passed && ' ✅'}</h3>
                            </button>
                        )
                    })
                }
            </div>
        )
    }

    function openClassStatistics(className) {
        setSelectedClass(className)
        setShowClassStatistics(true);
    }

    function displayClassStatistics(className) {
        const statistics = Object.entries(CLASS_LIST[className]);
        return (
            <div>
                <h3>{className} Minimum Stat Requirements:</h3>
                {
                    statistics.map(([name, value]) =>
                    (
                        <p>{name}: {value}</p>
                    ))
                }
                <button onClick={() => {
                    setSelectedClass(null);
                    setShowClassStatistics(false)
                }}>Close Requirements</button>
            </div>
        )
    }


    function displaySkills() {
        return (
            <div>
                {
                    skills.map((skill) => (
                        <div className="Skills-list">
                            <p> {skill.name}: {skill.count}</p>
                            <div className="Skills-buttons">
                                <button key={`${skill.name}-decrement`}>-</button>
                                <button key={`${skill.name}-increment`}>+</button>
                            </div>
                        </div>
                    ))
                }
            </div >
        )
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>React Coding Exercise</h1>
            </header>
            <section className="App-section">
                <div className="Attributes-section">{displayAttributes()}</div>
                <div className="Classes-section">
                    {displayClasses()}
                    {showClassStatistics && displayClassStatistics(selectedClass)}
                </div>
                <div className="Skills-section">
                    {skills && displaySkills()}
                </div>
            </section>
        </div>
    );
}

export default App;
