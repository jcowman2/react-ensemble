import React from "react";
/** @jsx jsx */
import { jsx, Box, Heading, Text, Flex } from "theme-ui";

export interface AnimationCardProps {
  title: string;
  body: string[];
  className?: string;
}

const AnimationCard: React.FC<AnimationCardProps> = props => {
  return (
    <Box className={props.className} sx={{ flex: 1 }}>
      <Flex sx={{ justifyContent: "center", alignItems: "center" }}>
        {props.children}
      </Flex>
      <Heading mt={4}>{props.title}</Heading>
      {props.body.map((text, idx) => (
        <Text key={idx} sx={{ mt: 3 }}>
          {text}
        </Text>
      ))}
    </Box>
  );
};

export default AnimationCard;
