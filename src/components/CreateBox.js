import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

const CreateBox = ({title, colorNum, colorsUsed, setColorsUsed, colorsLeft, setColorsLeft, saveData}) => {        
    
    return (
      <Grid item xs={5}>
        <Box fontSize={24} textAlign="center" height={28} border={3} p={1}>{title}</Box>
          <Box textAlign="center" height={240} borderLeft={3} borderRight={3} borderBottom={3} pt={1.5}style={{backgroundColor: colorsUsed[colorNum]}}>
            <Box display="inline-block" p={1} bgcolor="white" mt={11}>
              <label>Choose Color: </label>
              <select onChange={(e)=>{
                // remove new color from colorsLeftNow
                let colorsLeftNow = colorsLeft
                colorsLeftNow = colorsLeftNow.filter((color) => color!==e.target.value)
                // if last color exists, add to colorsLeftNow
                let colorsUsedNow = colorsUsed
                if (colorsUsedNow[colorNum]) { colorsLeftNow = [colorsUsedNow[colorNum], ...colorsLeftNow] }
                // adds newly selected color to colorUsed
                
                colorsUsedNow[colorNum] = e.target.value
                // trying to fix concatenation
                setColorsUsed(colorsUsedNow)
                setColorsLeft(colorsLeftNow)
                saveData()
              }}
                value={colorsUsed[colorNum]}
                >
                <option value={colorsUsed[colorNum]} disabled hidden>{colorsUsed[colorNum]}</option>  
                {colorsLeft.map(color=>{
                    return <option key={color} value={color}>{color}</option>
                })}
              </select>
            </Box>
        </Box>
      </Grid>
    )
  }

  export default CreateBox;

  